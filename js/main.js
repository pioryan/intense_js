/**
 * Created by pio on 30/01/2018.
 */
//console.log(JSON.parse(window.associates))
jQuery(function($) {
    $(document).ajaxStart(function(){
        $("#wait").css("display", "block");
    });
    $(document).ajaxComplete(function(){
        $("#wait").css("display", "none");
    });
    $("#sync").click(function(){

        $.ajax({
            type: "POST",
            url: "https://intense-tracker.herokuapp.com/associates/sync",
            //url: "http://localhost:3000/associates/sync",
            data: { associates: localStorage.getItem('associates') },
            success: function(data){
                console.log(data['status'])
                localStorage.setItem('associates', JSON.stringify(data['associates']))
                localStorage.setItem('mentors', JSON.stringify(data['mentors']))
                localStorage.setItem('ranks', JSON.stringify(data['ranks']))
                location.reload();
            },
            dataType: 'json'
        });
    });
    $( "#associate" ).autocomplete({
            minLength: 3,
            source: JSON.parse(localStorage.getItem('associates')),
            focus: function( event, ui ) {
                $( "#associate" ).val( ui.item.label );
                return false;
            },
            select: function( event, ui ) {
                $( "#associate" ).val( ui.item.label );
                $( "#associate-id" ).val( ui.item.value );
                $( "#usana_id" ).val( ui.item.usana_id );
                $( "#full_name" ).val( ui.item.full_name );
                $( "#first_name" ).val( ui.item.first_name );
                $( "#last_name" ).val( ui.item.last_name );
                $( "#mentor" ).val( ui.item.mentor );
                $( "#rank" ).val( ui.item.rank );
                $( "#mobile_number" ).val( ui.item.mobile_number );

                return false;
            }
        })
        .autocomplete( "instance" )._renderItem = function( ul, item ) {
        return $( "<li>" )
            .append( "<div>" + item.label + "</div>" )
            .appendTo( ul );
    };

    $( "#mentor" ).autocomplete({
        source: JSON.parse(localStorage.getItem('mentors'))
    });

    $( "#rank" ).autocomplete({
        source: JSON.parse(localStorage.getItem('ranks'))
    });

    $( "#register" ).submit(function( event ) {
        data = {
            id: $( "#associate-id" ).val(),
            usana_id: $( "#usana_id" ).val(),
            full_name: $( "#first_name" ).val() + ' ' + $( "#last_name" ).val(),
            first_name: $( "#first_name" ).val(),
            last_name: $( "#last_name" ).val(),
            mentor: $( "#mentor" ).val(),
            rank: $( "#rank" ).val(),
            mobile_number: $( "#mobile_number" ).val(),
            label: $( "#usana_id" ).val() + ' ' + $( "#full_name" ).val(),
            value: $( "#associate-id" ).val(),
        }
        event_id = getParameterByName("event_id")
        if(event_id !='' && event_id != undefined){
            data["event_id"] = event_id
        }
        console.log(data)
        // update associates
        setted = false
        associates = JSON.parse(localStorage.getItem('associates'));
        for (var i = 0;  i < associates.length; i++) {
            //update by id -- existing from DB
            if((data.id !='' && data.id != undefined ) && data.id == associates[i].id){
                associates[i] = data
                setted = true
            }
            //update by associates
            if(data.id !='' || data.id != undefined ){
                //-- existing from local file -- use label from search box
                if( $( "#associate" ).val() == associates[i].label ){
                    associates[i] = data
                    setted = true
                }
            }
        }
        if(setted == false){
            associates.push(data)
        }
        // save
        localStorage.setItem('associates', JSON.stringify(associates))
        // refresh
        alert( "User Registered! :)" );
        location.reload();
        event.preventDefault();
    });


    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }


})