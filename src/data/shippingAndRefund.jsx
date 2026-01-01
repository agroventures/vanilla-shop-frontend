import { Link } from "react-router-dom";

export const lastUpdated = "24th October 2025";

export const shippingAndRefund = [
    {
        id: 1,
        title: "Shipping Policy",
        description: (
            <div className="space-y-4">
                <span className="text-md font-semibold">1.1 Delivery Locations</span>
                <p className="m-3">
                    We ship products to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li className="font-semibold">All regions within Sri Lanka</li>
                    <li className="font-semibold">Most international destinations worldwide</li>
                </ul>
                <p className="my-3">If you are unsure whether your country is supported, please email us at <Link to='mailto:info@thevanillashop.lk'>info@thevanillashop.lk</Link>
                    and we will assist you.</p>
                <span className="text-md font-semibold">1.2 Delivery Timeframes</span>
                <p className="text-charcoal/70 font-semibold text-sm m-3">
                    Local Deliveries (Sri Lanka)
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Colombo & Suburbs:</strong> 1 – 3 working days</li>
                    <li><strong>Outstation:</strong> 2 – 5 working days</li>
                </ul>
                <p className="text-charcoal/70 font-semibold text-sm m-3">
                    International Deliveries
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Asia & Middle East:</strong> 7 – 14 business days</li>
                    <li><strong>Europe & North America:</strong> 10 – 21 business days</li>
                    <li><strong>Africa & Oceania:</strong> 14 – 28 business days</li>
                </ul>
                <p className="my-3">Delivery times may vary depending on destination country import processing, customs
                    clearance, courier delays, and public holidays.
                </p>
                <span className="text-md font-semibold">1.3 Shipping Fees</span>
                <p className="m-3">
                    Shipping fees are calculated based on:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Delivery destination</li>
                    <li>Total weight of order</li>
                    <li>Courier rates at the time of purchase</li>
                </ul>
                <p className="my-3">Shipping cost will be shown at checkout before payment.</p>
                <span className="text-md font-semibold">1.4 Customs, Duties & Import Taxes (International Orders)</span>
                <p className="m-3">
                    International customers are responsible for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Customs clearance fees</li>
                    <li>Import duties</li>
                    <li>VAT / GST / Local taxes as required by their destination country’s regulations.</li>
                </ul>
                <p className="font-semibold my-3">We are not responsible for delays caused by customs inspections.</p>
                <span className="text-md font-semibold">1.5 Order Tracking</span>
                <p className="m-3">
                    Once your order is dispatched, you will receive:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Confirmation email</li>
                    <li>Tracking number (where applicable)</li>
                </ul>
                <p className="my-3">Tracking availability depends on the courier selected.</p>
                <span className="text-md font-semibold">1.6 Failed Deliveries</span>
                <p className="m-3">
                    If delivery fails due to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Incorrect address</li>
                    <li>Unavailable recipient</li>
                    <li>Incorrect contact details</li>
                </ul>
                <p className="mt-3">A <strong>redelivery</strong> or <strong>return fee</strong> may apply.<br />
                    If a package is returned to us due to incomplete/incorrect information, we can reship at the
                    buyer’s expense.</p>
            </div>
        ),
    },
    {
        id: 2,
        title: "Refund & Return Policy",
        description: (
            <div className="space-y-4">
                <p className="mb-3">
                    Our products are food-grade agricultural consumables, therefore, we do not accept returns for
                    opened, used, or tampered products.
                </p>
                <p className="mb-3">However, we do accept replacement or refund requests under the following conditions:</p>
                <p className="text-md font-semibold mb-3">2.1 Eligible Refund / Replacement Situations</p>
                <ul className="list-disc pl-6 space-y-2 mb-3">
                    <li>The product received is <strong>damaged</strong> during delivery</li>
                    <li>The product received is <strong>incorrect</strong> (wrong product/quantity)</li>
                    <li>The product is <strong>defective</strong> upon arrival</li>
                </ul>
                <p className="text-md font-semibold mb-3">2.2 Time Window to Report Issues</p>
                <p className="mb-3">You must notify us <strong>within 48 hours of receiving your order.</strong></p>
                <p className="text-md font-semibold mb-3">2.3 Required Proof</p>
                <p className="mb-3">Please email us:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Order number</li>
                    <li>Clear photos of:
                        <ul className="list-disc pl-6 space-y-2 mb-3">
                            <li>Outer packaging</li>
                            <li>Product(s) received</li>
                            <li>Damaged/defective area (if applicable)</li>
                        </ul>
                    </li>
                </ul>
                <p className="mb-3">Send to: <Link to='mailto:info@thevanillashop.lk'>info@thevanillashop.lk</Link></p>
            </div>
        ),
    },
    {
        id: 3,
        title: "Non-Refundable Situations",
        description: (
            <div className="space-y-4">
                <p className="mb-3">
                    Refunds or replacements <strong>will not</strong> be issued if:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Product is opened, used, or partially consumed</li>
                    <li>Product was damaged due to storage after delivery (moisture, pests, heat, etc.)</li>
                    <li>Refund request is submitted <strong>after 48 hours</strong></li>
                    <li>Customer <strong>changed their mind</strong> after purchase</li>
                    <li>International orders are delayed due to customs, shipping, or government clearance
                        procedures</li>
                </ul>
            </div>
        ),
    },
    {
        id: 4,
        title: "Refund Processing",
        description: (
            <div className="space-y-4">
                <p className="mb-3">
                    If approved:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-3">
                    <li>Refunds will be issued to the <strong>same payment method</strong> used at the time of purchase</li>
                    <li>Processing time: <strong>5–10 working days</strong> (depending on your bank / payment gateway)</li>
                </ul>
                <p className="mb-3">
                    If a replacement is approved:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Replacement will be shipped at <strong>no additional cost</strong> for local orders</li>
                    <li><strong>For international customers,</strong> replacement shipping costs may apply</li>
                </ul>
            </div>
        ),
    },
    {
        id: 5,
        title: "Contact Us",
        description: (
            <div className="space-y-4">
                <p className="mb-3">For all shipping, return, and refund-related inquiries:</p>
                <p className="mb-3">
                    <span className="font-semibold">The Vanilla Shop</span><br />
                    Operated by <strong>Agroventures Exports (Pvt) Ltd</strong><br />
                    No. 48, Sir Marcus Fernando Mawatha, Colombo 07, Sri Lanka<br/>
                    <Link to='mailto:info@thevanillashop.lk'>info@thevanillashop.lk</Link>
                </p>
            </div>
        ),
    }
]