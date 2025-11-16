import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Card, CardBody, Col, Container, Form, FormFeedback, Input, Label, Row, Spinner } from 'reactstrap';
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { useDispatch, useSelector } from "react-redux";
import withRouter from "../../Components/Common/withRouter";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { createSelector } from 'reselect';
import { authenticateAPI } from '../../api/authAPI';
import { auth } from '../../helpers/firebase';

const Login = (props) => {
    const dispatch = useDispatch();
    const selectLayoutState = (state) => state;
    const loginpageData = createSelector(
        selectLayoutState,
        (state) => ({
            user: state.Account.user,
            error: state.Login.error,
            loading: state.Login.loading,
            errorMsg: state.Login.errorMsg,
        })
    );

    const {
        errorMsg
    } = useSelector(loginpageData);

    const [isSignInWithNumber, setIsSignInWithNumber] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = props.router.navigate;

    useEffect(() => {
        return () => {
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        };
    }, []);


    const setupRecaptcha = () => {
        try {
            if (!window.recaptchaVerifier) {
                console.log('Setting up reCAPTCHA...');
                window.recaptchaVerifier = new RecaptchaVerifier(
                    auth,
                    'recaptcha-container',
                    {
                        size: 'invisible',
                        callback: (response) => {
                            console.log('reCAPTCHA verified successfully');
                        },
                        'expired-callback': () => {
                            console.log('reCAPTCHA expired');
                        }
                    }
                );
                console.log('reCAPTCHA setup complete');
            }
        } catch (error) {
            console.error('Error setting up reCAPTCHA:', error);
            throw error;
        }
    };

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            orgID: "",
            mobile: "",
        },
        validationSchema: Yup.object().shape({
            orgID: Yup.string()
                .trim()
                .required("Please enter organisation ID"),
            mobile: Yup.string()
                .trim()
                .required("Please enter your mobile number")
                .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                setupRecaptcha();
                const phoneNumber = `+91${values.mobile}`;
                // Send OTP
                const confirmation = await signInWithPhoneNumber(
                    auth,
                    phoneNumber,
                    window.recaptchaVerifier
                );

                setIsSignInWithNumber(true);
                setConfirmationResult(confirmation)
                setLoading(false); 
            } catch (error) {
                setLoading(false); 
                console.log("error: sign in with phone number: ", error);
            }
        },
    });

    const inputsRef = useRef([]);

    // Ensure refs length = 6
    const setInputRef = (el, idx) => {
        inputsRef.current[idx] = el;
    };

    const moveToNext = (idx, e) => {
        const val = e?.target?.value || "";
        // only keep digits
        const digit = val.replace(/\D/g, "").slice(0, 1);
        e.target.value = digit;

        if (digit && idx < 5) {
            inputsRef.current[idx + 1]?.focus();
            inputsRef.current[idx + 1].select?.();
        }
    };

    const handleKeyDown = (idx, e) => {
        if (e.key === "Backspace") {
            // If current input has value, clear it first
            if (e.target.value) {
                e.target.value = "";
                setTimeout(() => {
                    // keep focus in same input
                }, 0);
            } else if (idx > 0) {
                // move to prev and clear it
                inputsRef.current[idx - 1]?.focus();
                inputsRef.current[idx - 1].value = "";
            }
            setError("");
        } else if (e.key === "ArrowLeft" && idx > 0) {
            inputsRef.current[idx - 1]?.focus();
        } else if (e.key === "ArrowRight" && idx < 5) {
            inputsRef.current[idx + 1]?.focus();
        } else if (!/^[0-9]$/.test(e.key) && e.key.length === 1) {
            // block non-digit printable characters
            e.preventDefault();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData("text");
        const digits = paste.replace(/\D/g, "").slice(0, 6).split("");
        if (digits.length === 0) return;

        digits.forEach((d, i) => {
            if (inputsRef.current[i]) inputsRef.current[i].value = d;
        });

        // focus next empty or last
        const firstEmpty = inputsRef.current.findIndex((el) => !el.value);
        const focusIdx = firstEmpty === -1 ? Math.min(digits.length, 5) : firstEmpty;
        inputsRef.current[focusIdx]?.focus();
    };

    const getOtpValue = () => {
        return inputsRef.current.map((el) => (el ? el.value : "")).join("");
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const otp = getOtpValue();
        try {
            if (!otp || otp.length !== 6) {
                setError('Please enter a valid 6-digit OTP');
                setLoading(false);
                return;
            }

            const result = await confirmationResult.confirm(otp);
            const user = result.user;



            const payload = {
                uid: user.uid,
            }
            const response = await authenticateAPI(payload, validation.values.orgID);
            const storeAuthData = {
                status: "success",
                token: response.data.jwtToken,
                data: response.data.userDetails,
            }
            sessionStorage.setItem("authUser", JSON.stringify(storeAuthData));
            setLoading(false);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setError('Invalid OTP. Please try again.');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (errorMsg) {
            setTimeout(() => {
                dispatch(resetLoginFlag());
            }, 3000);
        }
    }, [dispatch, errorMsg]);

    document.title = "SignIn | Learning App";
    return (
        <React.Fragment>
            <ParticlesAuth>
                <div className="auth-page-content mt-lg-5">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center mt-sm-5 mb-4 text-white-50">
                                    <div>
                                        {/* <Link to="/" className="d-inline-block auth-logo">
                                            <img src={logoLight} alt="" height="20" />
                                        </Link> */}
                                    </div>
                                    {/* <p className="mt-3 fs-15 fw-medium">Premium Admin & Dashboard Template</p> */}
                                </div>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="mt-4">
                                    <CardBody className="p-2">
                                        {!isSignInWithNumber && (<>
                                            <div className="text-center mt-2">
                                                <h5 className="text-primary">Welcome Back !</h5>
                                                <p className="text-muted">Sign in to continue to the Learning App.</p>
                                            </div>
                                            {error && error ? (<Alert color="danger"> {error} </Alert>) : null}
                                            <div className="p-2 mt-4">
                                                <Form
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        validation.handleSubmit();
                                                        return false;
                                                    }}
                                                    action="#">
                                                    <div className="mb-3">
                                                        <Label htmlFor="orgID" className="form-label">Orgnisation ID</Label>
                                                        <Input
                                                            name="orgID"
                                                            className="form-control"
                                                            placeholder="Enter Orgnisation ID"
                                                            type="text"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.orgID || ""}
                                                            invalid={
                                                                validation.touched.orgID && validation.errors.orgID ? true : false
                                                            }
                                                        />
                                                        {validation.touched.orgID && validation.errors.orgID ? (
                                                            <FormFeedback type="invalid">{validation.errors.orgID}</FormFeedback>
                                                        ) : null}
                                                    </div>

                                                    <div className="mb-3">
                                                        <Label className="form-label" htmlFor="password-input">Mobile</Label>
                                                        <div className="position-relative auth-pass-inputgroup mb-3">
                                                            <Input
                                                                name="mobile"
                                                                value={validation.values.mobile || ""}
                                                                type="tel"
                                                                className="form-control pe-5"
                                                                placeholder="Enter Mobile Number"
                                                                onChange={validation.handleChange}
                                                                onBlur={validation.handleBlur}
                                                                invalid={
                                                                    validation.touched.mobile && validation.errors.mobile ? true : false
                                                                }
                                                            />
                                                            {validation.touched.mobile && validation.errors.mobile ? (
                                                                <FormFeedback type="invalid">{validation.errors.mobile}</FormFeedback>
                                                            ) : null}
                                                        </div>
                                                    </div>

                                                    {/* <div className="form-check">
                                                    <Input className="form-check-input" type="checkbox" value="" id="auth-remember-check" />
                                                    <Label className="form-check-label" htmlFor="auth-remember-check">Remember me</Label>
                                                </div> */}

                                                    <div className="mt-4">
                                                        <Button color="success" disabled={loading} className="btn btn-success w-100" type="submit">
                                                            {loading ? <Spinner size="sm" className='me-2'> Loading... </Spinner> : null}
                                                            Sign In
                                                        </Button>
                                                    </div>
                                                </Form>
                                            </div>
                                        </>)}

                                        {isSignInWithNumber && (<div className="p-2 mt-4">
                                            <div className="text-muted text-center mb-4 mx-lg-3">
                                                <h4 className="">Verify Your OTP</h4>
                                                <p>Please enter the 6 digit code sent to <span className="fw-semibold">{validation.values.mobile}</span></p>
                                            </div>

                                            <form onSubmit={handleVerifyOTP}>
                                                <Row>
                                                    {[0, 1, 2, 3, 4, 5].map((i) => (
                                                        <Col key={i} className="col-2">
                                                            <div className="mb-3">
                                                                <label htmlFor={`digit${i + 1}-input`} className="visually-hidden">{`Digit ${i + 1}`}</label>
                                                                <input
                                                                    id={`digit${i + 1}-input`}
                                                                    type="text"
                                                                    inputMode="numeric"
                                                                    pattern="[0-9]*"
                                                                    maxLength="1"
                                                                    className="form-control form-control-lg bg-light border-light text-center"
                                                                    ref={(el) => setInputRef(el, i)}
                                                                    onKeyUp={(e) => moveToNext(i, e)}
                                                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                                                    onPaste={handlePaste}
                                                                    autoComplete="one-time-code"
                                                                    aria-label={`Digit ${i + 1}`}
                                                                />
                                                            </div>
                                                        </Col>
                                                    ))}
                                                </Row>


                                                <div className="mt-3">
                                                    {/* <Button color="success" className="w-100">Confirm</Button> */}
                                                    <Button color="success" className="w-100" type="submit" disabled={loading}>
                                                        {loading ? <Spinner size="sm" className='me-2' /> : null}
                                                        Confirm
                                                    </Button>
                                                </div>
                                            </form>

                                        </div>)}
                                    </CardBody>
                                </Card>
                                <div id="recaptcha-container"></div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>
        </React.Fragment>
    );
};

export default withRouter(Login);