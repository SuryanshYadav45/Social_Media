const nodemailer=require('nodemailer')

const sendcode= async(email,fullname,verificationCode)=>
    {
        const auth=nodemailer.createTransport({
            service:'gmail',
            secure:true,
            port:465,
            auth:{
                user:"ggvenom418@gmail.com",
                pass:"poewzddewrzuzdej"
            }
        })
        
        const receiver={
            from:"ggvenom418@gmai.com",
            to:email,
            subject:"verification",
            html: `
                <html>
                    <head>
                        <style>
                            /* Add CSS styles here */
                        </style>
                    </head>
                    <body>
                        <h4>Congratulations ${fullname} on creating an account on our application!</h4>
                        <p>To complete the verification of your account, use the below code:</p>
                        <h3><b>${verificationCode}</b></h3>
                        <br>
                        <h5>Team Instagram</h5>
                    </body>
                </html>
            `
        };


        auth.sendMail(receiver,(error,emailResponse)=>{
            if(error)
                {
                    console.log(error)
                }
        
                else{
                    return true;
                }
        })
    }

    module.exports=sendcode;