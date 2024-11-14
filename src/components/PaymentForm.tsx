import Image from "next/image";

const PaymentForm = () => {
  return (
    <div className="max-w-lg mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
      <h2 className="text-center text-2xl font-semibold mb-6">Payment Form</h2>
      <form>
        <div className="mb-4">
          <label htmlFor="name" className="block font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block font-medium">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <label className="block font-medium">Payment Method</label>
        <div className="flex justify-between space-x-4 mb-6">
          <div className="flex items-center">
            <label htmlFor=""></label>
            <input
              type="radio"
              id="paypal"
              name="payment_method"
              value="PayPal"
              className="mr-2"
            />
            <label htmlFor="paypal">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/a/a4/PayPal_logo_2014.svg"
                alt="PayPal"
                width={30}
                height={30}
              />
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              id="apple_pay"
              name="payment_method"
              value="Apple Pay"
              className="mr-2"
            />
            <label htmlFor="apple_pay">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Apple_Pay_logo.svg"
                alt="Apple Pay"
                width={30}
                height={30}
              />
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              id="swish"
              name="payment_method"
              value="Swish"
              className="mr-2"
            />
            <label htmlFor="swish">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/4/4b/Swish_logo_2019.svg"
                alt="Swish"
                width={30}
                height={30}
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
