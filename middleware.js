function authRole(role){
    return(req,res,next)=>{
      if(req.user.role!=role){
        return res.send("not allowed!")
      }
      next();
    }
  }
//   function authUser(req,res,next){
//     if(req.user==null){
//       return res.send("not allowed!")
//     }

//   }
module.exports=authRole;