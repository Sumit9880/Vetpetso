import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-white border-y">
            <div className="flex flex-col items-center sm:flex-row sm:justify-between p-5">
                <span className="text-sm text-gray-500 mb-2 sm:mb-0">
                    © 2024{' '}
                    <a href="https://etenraltechservices.com/" className="hover:underline text-blue-400">
                        Etenral Tech Services
                    </a>
                    . All Rights Reserved.
                </span>
                <div className="flex mt-2 space-x-5">
                    <a
                        href="https://instagram.com/"
                        className="hover:text-pink-600"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <svg
                            className="w-4 h-4"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.423.401.55.2.95.444 1.37.864.42.42.665.82.865 1.37.16.452.347 1.253.4 2.422.059 1.268.071 1.648.071 4.851s-.012 3.584-.071 4.85c-.054 1.17-.24 1.97-.401 2.423a3.902 3.902 0 0 1-.864 1.37c-.42.42-.82.665-1.37.865-.452.16-1.253.347-2.422.4-1.268.059-1.648.071-4.851.071s-3.584-.012-4.85-.071c-1.17-.054-1.97-.24-2.423-.401a3.902 3.902 0 0 1-1.37-.864 3.902 3.902 0 0 1-.865-1.37c-.16-.452-.347-1.253-.4-2.422-.059-1.268-.071-1.648-.071-4.851s.012-3.584.071-4.85c.054-1.17.24-1.97.401-2.423a3.902 3.902 0 0 1 .864-1.37 3.902 3.902 0 0 1 1.37-.865c.452-.16 1.253-.347 2.422-.4 1.268-.059 1.648-.071 4.851-.071m0-2.163c-3.259 0-3.667.014-4.947.072-1.278.058-2.155.24-2.91.51-.789.283-1.465.664-2.14 1.34-.676.675-1.057 1.352-1.34 2.14-.27.755-.452 1.632-.51 2.91-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.058 1.278.24 2.155.51 2.91.283.789.664 1.465 1.34 2.14.675.676 1.352 1.057 2.14 1.34.755.27 1.632.452 2.91.51 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.278-.058 2.155-.24 2.91-.51.789-.283 1.465-.664 2.14-1.34.676-.675 1.057-1.352 1.34-2.14.27-.755.452-1.632.51-2.91.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.058-1.278-.24-2.155-.51-2.91a5.85 5.85 0 0 0-1.34-2.14c-.675-.676-1.352-1.057-2.14-1.34-.755-.27-1.632-.452-2.91-.51-1.28-.058-1.688-.072-4.947-.072z"
                            />
                            <path
                                d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 1 0 0-12.324zm0 10.161a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.882 1.44 1.44 0 0 0 0-2.882z"
                            />
                        </svg>
                        <span className="sr-only">Instagram page</span>
                    </a>
                    <a
                        href="https://linkedin.com/"
                        className="hover:text-blue-700"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <svg
                            className="w-4 h-4"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zm-2.8 7.6h5.6v12h-5.6V11.1zM21 11.1h-5.6v1.4h.01c.09-.17.32-.4.67-.56 1.4-.81 3.28-1.1 4.4-1.1 1.7 0 2.4.7 2.4 2.1v7.5h-5.6v-7.5c0-1.4-.75-2.1-2.4-2.1-1.4 0-3 1.7-3.5 3.4h-.01v-1.4z"
                            />
                        </svg>
                        <span className="sr-only">LinkedIn page</span>
                    </a>
                    {/* <a
                        href="https://twitter.com/"
                        className="hover:text-blue-500"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <svg
                            className="w-4 h-4"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M22.46 6.003c-.807.358-1.675.598-2.577.705a4.516 4.516 0 0 0 1.98-2.482 9.026 9.026 0 0 1-2.87 1.096A4.516 4.516 0 0 0 16.116 5c-2.494 0-4.52 2.028-4.52 4.52 0 .354.04.699.117 1.031A12.857 12.857 0 0 1 3.423 4.623a4.495 4.495 0 0 0-.61 2.268c0 1.567.798 2.947 2.01 3.762a4.505 4.505 0 0 1-2.05-.566v.057c0 2.184 1.552 4.006 3.605 4.42a4.526 4.526 0 0 1-2.045.078c.578 1.807 2.245 3.127 4.224 3.162a9.058 9.058 0 0 1-5.62 1.945c-.364 0-.722-.021-1.075-.061a12.798 12.798 0 0 0 6.905 2.021c8.28 0 12.812-6.868 12.812-12.812 0-.196-.004-.392-.014-.586a9.17 9.17 0 0 0 2.256-2.334z"
                            />
                        </svg>
                        <span className="sr-only">Twitter page</span>
                    </a> */}
                    <a
                        href="https://twitter.com/"
                        className="hover:text-blue-500"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <svg
                            className="w-4 h-4"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                            />
                        </svg>
                        <span className="sr-only">Twitter page</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

`Privacy Policy

 Introduction
Welcome to Vetpetso, developed by पशुवैद्यकीय, पशुसंवर्धन आणि दुग्ध व्यवस्थापन सेवा संघ.. We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application.

 Information We Collect
-Personal Information: When you register for a subscription, we collect personal information such as your name, email address, payment information, and veterinary license details.
-Case Data: Information regarding the cases you manage, including patient details, diagnosis, treatment, and reports.
-Usage Data: Information on how you use the app, including access times, pages viewed, and the actions taken within the app.

 How We Use Your Information
-To Provide Services: We use your personal and case data to offer our subscription services, including case management, report generation, and data export.
-To Improve Our Services: We analyze usage data to understand how our app is used and to enhance its functionality and user experience.
-To Communicate with You: We may use your contact information to send you updates, support messages, and other information related to your subscription.
-To Ensure Data Security: Your data is stored in a secure MySQL database on a VPS, and we implement strict security measures to protect it from unauthorized access or disclosure.

 Data Sharing and Disclosure
-Third-Party Service Providers: We may share your data with third-party service providers who perform services on our behalf, such as payment processing and data storage.
-Legal Compliance: We may disclose your information if required by law or in response to legal requests.

 Data Security
We prioritize the security of your data and employ various measures, including encryption, firewalls, and secure server facilities, to protect it. Regular audits and security updates are conducted to ensure the safety of your information.

 Your Rights
-Access and Update: You can access your personal information within the app settings. However, updates and deletions of data are not permitted as the records are maintained for governmental proof and compliance purposes.

 Changes to this Privacy Policy
We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on our app and informing you via email.

 Contact Us
If you have any questions about this Privacy Policy or our data practices, please contact us at sumitghatage4@gmail.com or +91 8618749880.



Terms of Use

 Introduction
These Terms of Use ("Terms") govern your access to and use of Vetpetso, developed by पशुवैद्यकीय, पशुसंवर्धन आणि दुग्ध व्यवस्थापन सेवा संघ.. By using our app, you agree to comply with these Terms.

 Subscription Plans
-Paid Membership: Our app offers two subscription plans for veterinary professionals who are members of पशुवैद्यकीय, पशुसंवर्धन आणि दुग्ध व्यवस्थापन सेवा संघ.. The details of each plan, including features and pricing, are available on our subscription page.
-Payment: Subscription fees are billed on a monthly or annual basis, depending on the chosen plan. Payment is processed securely via our third-party payment provider.

 User Responsibilities
-Account Security: You are responsible for maintaining the confidentiality of your account information, including your username and password.
-Accurate Information: You must provide accurate and complete information when registering for a subscription and using the app.
-Compliance: You agree to use the app in compliance with all applicable laws and regulations.

 Use of the App
-Case Management: Our app allows you to record, categorize, and save case information, generate reports, share prescriptions and case papers in PDF format, and export reports in Excel sheets.
-Data Storage: All data is stored in a secure MySQL database on a VPS managed by पशुवैद्यकीय, पशुसंवर्धन आणि दुग्ध व्यवस्थापन सेवा संघ.. We take reasonable measures to ensure the security of your data.

 Prohibited Activities
-Unauthorized Access: You must not attempt to gain unauthorized access to any part of the app or its underlying systems.
-Malicious Activity: You must not use the app to engage in any activity that is harmful, unlawful, or violates the rights of others.

 Termination
-Termination by You: You may cancel your subscription at any time through the app settings.
-Termination by Us: We reserve the right to terminate your access to the app if you violate these Terms or engage in any prohibited activity.

 Limitation of Liability
To the maximum extent permitted by law, Vetpetso and पशुवैद्यकीय, पशुसंवर्धन आणि दुग्ध व्यवस्थापन सेवा संघ. are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the app.

 Changes to these Terms
We may update these Terms from time to time. We will notify you of any significant changes by posting the new terms on our app and informing you via email.

 Contact Us
If you have any questions about these Terms of Use, please contact us at sumitghatage4@gmail.com or +91 8618749880.
` 