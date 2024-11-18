import React from "react";

type FormData = {
  name: string;
  email: string;
  phone: string;
  payment_method: string;
};

type FormErrors = {
  name: string;
  email: string;
  phone: string;
  payment_method: string;
};

type PaymentFormProps = {
  formData: FormData;
  formErrors: FormErrors;
  onFormChange: (data: FormData) => void;
};

const PaymentForm: React.FC<PaymentFormProps> = ({
  formData,
  formErrors,
  onFormChange,
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onFormChange({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email: string) => {
    // Regex for a simple email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: FormErrors = {
      name: formData.name ? "" : "Name is required",
      email: validateEmail(formData.email)
        ? ""
        : "Please enter a valid email address",
      phone: formData.phone ? "" : "Phone number is required",
      payment_method: formData.payment_method
        ? ""
        : "Please select a payment method",
    };

    // If no errors, submit the form data
    if (!Object.values(errors).some((error) => error)) {
      console.log("Form submitted", formData);
    } else {
      onFormChange({ ...formData, email: formData.email }); // Optionally reset email field or any other state.
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
        {formErrors.name && (
          <p className="text-red-500 text-sm">{formErrors.name}</p>
        )}
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
        {formErrors.email && (
          <p className="text-red-500 text-sm">{formErrors.email}</p>
        )}
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
        {formErrors.phone && (
          <p className="text-red-500 text-sm">{formErrors.phone}</p>
        )}
      </div>

      <div>
       

        <div>
          <label className="block text-gray-700 mb-4">Payment Method</label>
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <input
                type="radio"
                id="swish"
                name="payment_method"
                value="swish"
                checked={formData.payment_method === "swish"}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="swish">Swish</label>
            </div>
            <div className="flex flex-col">
              <input
                type="radio"
                id="paypal"
                name="payment_method"
                value="paypal"
                checked={formData.payment_method === "paypal"}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="paypal">PayPal</label>
            </div>
            <div className="flex flex-col">
              <input
                type="radio"
                id="applePay"
                name="payment_method"
                value="ApplePay"
                checked={formData.payment_method === "ApplePay"}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="applePay">ApplePay</label>
            </div>
          </div>
        </div>

        {formErrors.payment_method && (
          <p className="text-red-500 text-sm">{formErrors.payment_method}</p>
        )}
      </div>
    </form>
  );
};

export default PaymentForm;
