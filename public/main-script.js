function onSignIn(googleUser) {
    var profile=googleUser.getBasicProfile();


    $.ajax({
        url:"/panel/google-login",
        method:"post",
        data:{
            "User":JSON.stringify(googleUser.getBasicProfile())
        },
        success:function (response) {

            if(response.status==false){
                signOut();
            }
            else{
                window.location.href="/panel"
            }
        }

    })

}
$(document).ready(function () {

        $("#destination-input").css("margin-top","50px")
    })

