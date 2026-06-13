async function testBackend() {
  try {
    const loginRes = await fetch('https://the-lables.onrender.com/api/auth/login', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email: 'test_order@gmail.com', password: 'password123' })
    });
    const { token } = await loginRes.json();

    const orderRes = await fetch('https://the-lables.onrender.com/api/orders', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        items: [{
          _id: "test-product-123", // Using _id instead of productId
          name: "Test",
          price: 100,
          quantity: 1,
          image: "http://example.com/img.jpg"
        }],
        total: 100,
        paymentMethod: 'cash_on_delivery',
        referenceCode: null,
        shippingDetails: {
           firstName: "Ahamad",
           lastName: "Mohamad",
           email: "test_order@gmail.com",
           phone: "+94771813023",
           address: "123 Test St"
        }
      })
    });

    console.log("Order response:", orderRes.status, await orderRes.text());
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

testBackend();
