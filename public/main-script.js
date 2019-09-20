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
    $(window).load(function () {
        console.log("done");
        var hour=0;
        for (hour=0;hour<24;hour++){

            $("#hour").append($("<option></option>").attr("value",hour).text(hour));
        }
        var min=0;
        for (min=0;hour<60;hour+=5){

            $("#min").append($("<option></option>").attr("value",hour).text(hour));
        }
    })

    $("#offer_trip_sub_btn").click(function () {
        $.ajax({
            url:"/panel/do-offer-trip",
            method:"post",
            data:{
                "date":$("#date").val(),
                "hour":$("#hour").val(),
                "min":$("#min").val(),
                "vehicle":$("#vehicle").val(),
                "seats":$("#seat").val(),
                "v_details":$("#vehicle_details").val(),
                "rules":$("#rules").val(),
                "user":$("#user").val(),
                "origin":$("#origin-input").val(),
                "destination":$("#destination-input").val(),


            },
            success:function (result) {
                console.log(result)
            }
        })
    })
    $(document).ready(function () {
        $("#add_city_form").validate();
        alert("hello")
        $("#add_city_form").validate({
            rules:{
                CityName:"required"
            },
            submitHandler: function(form) {
                // do other things for a valid form
                form.submit();
            }

        })
    })




})
