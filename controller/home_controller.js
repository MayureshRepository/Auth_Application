const User = require('../model/user');
const bcrypt = require('bcrypt');
//Here, saltRounds is set to 10, which means that bcrypt will perform 2^10 (1024) iterations of the key derivation function.
// You can adjust this value based on your security requirements. A higher 
//value will increase the security of your passwords but will also make the hashing process slower.
const saltRounds = 10;

module.exports.home = function (req, res) {
   
     res.render('home');
}

module.exports.profile =  function (req, res) {
     // try {
     //      console.log("req.cookies.user_id " ,req.cookies.user_id);
     //      if (req.cookies.user_id) {
     //           let Userfound = await User.findById({ _id: req.cookies.user_id });
     //             console.log("User found in profile " , Userfound);

     //           if (Userfound) {
     //                return res.render('profile', {
     //                     title: "User Profile",
     //                     data: Userfound
     //                });
     //           }
     //           else {
     //                return res.redirect('/');
     //           }

     //      }
     //      //If cookie is not there so will redirect to login(Home)
     //      else {
     //           return res.redirect('/');
     //      }

     // } catch (error) {
     //       console.log(`There is an error : ${error}`);
     //      res.json(`${error}`);
     // }
     return res.render('profile', {
          title: 'User Profile'
      })
}
module.exports.signIn = function (req, res) {

     if(req.isAuthenticated()){
          return res.redirect('/profile');
     }


     return res.render('sign_in');
}

module.exports.signUp = function (req, res) {

     if(req.isAuthenticated()){
          return res.redirect('/profile');
     }
    return res.render('sign_up');
}

// //Signout logic
// module.exports.signout = function(req,res){
//      req.logout();
//      return res.redirect('/');
// }

// Signout logic
module.exports.signout = async function(req, res) {
     try {
         // Wrap req.logout in a promise
         const logoutPromise = () => new Promise((resolve, reject) => {
             req.logout((err) => {
                 if (err) {
                     reject(err);
                 } else {
                     resolve();
                 }
             });
         });
 
         // Await the logout promise
         
    // Show an info message
    //toastr.info('User Logged Out', 'Info');

         await logoutPromise();
         req.flash('success' , 'Logged Out Successfully');
         // Redirect after successful logout
         return res.redirect('/');
     } catch (error) {
         // Handle errors during logout
         console.log('Error during logout:', error);
         return res.redirect('/');
     }
 };
 
// get the sign up data
module.exports.create = async function (req, res) {
     try {
          if (req.body.password !== req.body.confirmpassword) {
               //console.log('Passwords are not matching');
               req.flash('error' , 'Passwords are not matching');
               return res.render('sign_up');
          }
          else {

               const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
               let createNewUser = await User.create({
                    email: req.body.email,
                    password: hashedPassword,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name

               });
               return res.redirect('/');
          }
     } catch (error) {
          console.log(`There is an error : ${error}`);
     }

}

// sign in and create a session for the user
// module.exports.create = async function (req, res) {
//      try {
//           let findUser = await User.findOne({ email: req.body.email });
//           if (!findUser) {
//                console.log("User is not Present");
//                return res.redirect('/');
//           }
//           else {
//                // Compare the hashed password during login
//                const isPasswordValid = await bcrypt.compare(req.body.password, findUser.password);
//                // console.log("isPasswordValid" , isPasswordValid);
//                if (!isPasswordValid) {
//                     return res.redirect('/');
//                }
//                else {
//                     //Setting the Cookie Manually 
//                     res.cookie('user_id', findUser.id);
//                     //Redirecting to profile page it will verify the cookie if present will show login page
//                     return res.redirect('/profile');
//                }
//           }
//      } catch (error) {
//           console.log(`There is an error : ${error}`);
//      }

// }


 module.exports.createSession =  function (req, res) {
 

   
  req.flash('success' , 'Logged in Successfully');
  return res.redirect('/');
  //return res.redirect('/');
 }


 module.exports.resetPasswordPage =function(req,res){

     return res.render('change_password');


 }


 module.exports.resetPassword = async function(req,res){
let userId = req.user.id;
console.log("User bodt id" , userId);
 console.log("User req.body in reset pass" , req.body);


     try {
       let userdata = await User.findById(userId) ;
       console.log("Userdata ",userdata);
       if(userdata){
          const isPasswordValid = await bcrypt.compare( req.body.password ,userdata.password);
          // console.log('isPasswordValid inside password Change' ,isPasswordValid );
          if (!isPasswordValid) {
              //console.log('Invalid Password');
              req.flash('error' ,'Invalid Password');
              return res.redirect('/getpasswordChange');
            
          }
          else{            
              if(req.body.newpassword !== req.body.confirmPassword){
               //console.log('Passwords are not matching');
               req.flash('error' ,'Passwords are not matching');
               return res.redirect('/getpasswordChange');
              }else{
               let newHashedpassword = await bcrypt.hash(req.body.newpassword,saltRounds);
                await User.findByIdAndUpdate(userId , {password:newHashedpassword});
                 // Redirect to a success page or profile page
    return res.redirect('/profile');
              }

          }
       }
       
     } catch (error) {
           // Handle errors, e.g., database errors
    console.error('Error changing password:', error);
    res.render('change-password', { error: 'An error occurred. Please try again later.' });
     }

 }


