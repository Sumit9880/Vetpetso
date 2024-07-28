import React from 'react';

const TermsOfUse = () => {
    return (
        <div className="bg-tertiary py-2">
            <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl">
                <div className="mb-6 flex justify-center items-center">
                    <h3 className="text-3xl text-center text-primary font-poppins font-semibold relative heading_section inline-block pb-2">
                        Terms of Use
                    </h3>
                </div>
                <p className="mb-4 text-gray-900 font-medium">Last Updated: 25-07-2024</p>

                <p className="mb-6 text-gray-800 leading-relaxed">
                    Welcome to the <span className='text-primary font-bold'>पशुवैद्यकीय, पशुसंवर्धन आणि दुग्ध व्यवस्थापन सेवा संघ.</span> website (<a href="http://www.vetpetso.com" className="text-blue-500 hover:underline">www.vetpetso.com</a>). By accessing or using our website, you agree to comply with and be bound by these Terms of Use. Please read these terms carefully.
                </p>

                <h2 className="text-xl font-semibold mb-3 text-black">1. Acceptance of Terms</h2>
                <p className="mb-6 text-gray-800 leading-relaxed">
                    By accessing or using our website, you agree to these Terms of Use and our Privacy Policy. If you do not agree, please do not use our website.
                </p>

                <h2 className="text-xl font-semibold mb-3 text-black">2. Use of Website</h2>
                <ul className="list-disc list-inside mb-6 text-gray-800 leading-relaxed">
                    <li>Eligibility: You must be at least 18 years old to use our website.</li>
                    <li>Permitted Use: You may use our website for lawful purposes and in accordance with these Terms of Use. You agree not to use our website for any unlawful or prohibited activity.</li>
                </ul>

                <h2 className="text-xl font-semibold mb-3 text-black">3. Intellectual Property</h2>
                <p className="mb-6 text-gray-800 leading-relaxed">
                    All content on our website, including text, graphics, logos, images, and software, is the property of <span className='text-primary font-bold'>पशुवैद्यकीय, पशुसंवर्धन आणि दुग्ध व्यवस्थापन सेवा संघ.</span> and is protected by copyright and other intellectual property laws. You may not use, reproduce, distribute, or create derivative works from our content without our prior written permission.
                </p>

                <h2 className="text-xl font-semibold mb-3 text-black">4. User Contributions</h2>
                <p className="mb-6 text-gray-800 leading-relaxed">
                    You may have the opportunity to submit content, such as comments or posts, to our website. By submitting content, you grant us a non-exclusive, royalty-free, perpetual, and worldwide license to use, reproduce, modify, and distribute your content.
                </p>

                <h2 className="text-xl font-semibold mb-3 text-black">5. Disclaimers</h2>
                <ul className="list-disc list-inside mb-6 text-gray-800 leading-relaxed">
                    <li>No Warranties: Our website is provided on an "as is" and "as available" basis. We make no warranties or representations about the accuracy or completeness of the content on our website.</li>
                    <li>Limitation of Liability: We are not liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your use of our website.</li>
                </ul>

                <h2 className="text-xl font-semibold mb-3 text-black">6. Indemnification</h2>
                <p className="mb-6 text-gray-800 leading-relaxed">
                    You agree to indemnify and hold harmless <span className='text-primary font-bold'>पशुवैद्यकीय, पशुसंवर्धन आणि दुग्ध व्यवस्थापन सेवा संघ.</span>, its officers, directors, employees, and agents from any claims, damages, liabilities, and expenses arising out of your use of our website or violation of these Terms of Use.
                </p>

                <h2 className="text-xl font-semibold mb-3 text-black">7. Governing Law</h2>
                <p className="mb-6 text-gray-800 leading-relaxed">
                    These Terms of Use are governed by and construed in accordance with the laws of India/Maharashtra, without regard to its conflict of law principles.
                </p>

                <h2 className="text-xl font-semibold mb-3 text-black">8. Changes to These Terms</h2>
                <p className="mb-6 text-gray-800 leading-relaxed">
                    We may update these Terms of Use from time to time. Any changes will be posted on this page with an updated revision date. Your continued use of our website after any changes constitute your acceptance of the new terms.
                </p>

                <h2 className="text-xl font-semibold mb-3 text-black">9. Contact Us</h2>
                <p className="text-gray-800 leading-relaxed">
                    If you have any questions about these Terms of Use, please contact us at <a href="mailto:ngovetprof@gmail.com" className="text-blue-500 hover:underline">ngovetprof@gmail.com</a> or +91 9800067881.
                </p>
            </div>
        </div>
    );
};

export default TermsOfUse;
