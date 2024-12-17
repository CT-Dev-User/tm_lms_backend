<!-- added subscription of user code in controller/course.js (fetchLecture.js) 
inside (
    
    if(!user.subscription.includes(req.params.id)) return res.status(400).json({
        message : "you have not subscribed to this course",
    });

) -->