import React from "react";


type FormData = {
  name: string;
  email: string;
  phone: string;
  payment_method: string;
}

type FormErrors = {
  name: string;
  email: string;
  phone: string;
  payment_method: string;
}

// Define types for PaymentForm props
type PaymentFormProps = {
  formData: FormData;
  formErrors: FormErrors;
  onFormChange: (data: FormData) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ formData, formErrors, onFormChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onFormChange({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
        {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
      </div>

      <div>
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
        {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
      </div>

      <div>
        <label className="block text-gray-700">Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
        {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}
      </div>

      <div>
        <label className="block text-gray-700">Payment Method</label>
        <select
          name="payment_method"
          value={formData.payment_method}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Payment Method</option>
          <option value="credit_card">Credit Card</option>
          <option value="paypal">PayPal</option>
        </select>
        {formErrors.payment_method && <p className="text-red-500 text-sm">{formErrors.payment_method}</p>}
      </div>
    </div>
  );
};

export default PaymentForm;
