function operateFormatter(value, row, index) {

              // return [
              // '<a href="'+baseUrl+'users/edit/'+ row._id + '" class="btn btn-info edit">Edit</a>',
              // // '<a href="'+baseUrl+'" class="btn btn-danger delete" data-id="'+row._id +'">Delete</a>'

              // ].join('');
              if(row.status === 1){
              	return[
             
              	'<a href="'+baseUrl+'users/edit/'+ row._id + '" class="btn btn-info edit">Edit</a>',
              	'<a href="'+baseUrl+'" class="btn btn-danger delete" data-id="'+row._id +'">Delete</a>'

              	].join('');
              }
              else{
              	return[
              	'<a href="'+baseUrl+'users/edit/'+ row._id + '" class="btn btn-info edit">Edit</a>',
              	].join('');

              }
          };

function statusAct(value, row, index) {

            if (row.status === 1){
            	return [
            	'<p id="status_'+row._id +'" class="act">active</p>'
            	].join('');}
            else{
            	return [
            	'<p id="status_'+row._id +'" class="inactive">inactive</p>'

            	].join('');
            }
        };

   function roleAct(value, row, index) {

               if (row.role === 1){
               	return [
               	'<p class="user">user</p>'
               	].join('');}
               else{
               	return [
               	'<p class="admin">admin</p>'

               	].join('');
               }
           };

$(function(){


  $(document).on("click", ".delete", function(e){
  	e.preventDefault();
  	var thisObj = this;
  	var id = $(this).data("id");
  	if(confirm("Are you sure?")) {
	    $.ajax({
	    	url: baseUrl+'users/delete',
	    	type: 'POST',
	    	data: { id: id },
	    	dataType: 'JSON',
	    	success: function (data) {
	    		if(data.success === 1){
	    			$('#status_'+id)
	    			.html("inactive")
	    			.removeClass("act")
	    			.addClass("inactive");
	    			$(thisObj).hide();
	    		}
	    		    			    	
	    		console.log(data);
	    		

	    	},
	    	error: function () {

	    	}

	    })
	}
  });

  // function getUsers(){
	 //  $.ajax({
	 //  url: baseUrl + 'users/ajax/get-users',
	 //  type: 'GET',
	 //  dataType: 'JSON',
	 //  success: function(data){
		//   if(data.success === 1) {
		// 	  var html = "";
		// 	  data.result.forEach(function(u){
		// 		  var statusHtml = '<td></td>';
		// 		  var deleteHtml = '';
		// 		  if(u.status === 0){

		// 		  	statusHtml = '<td class="inactive change">inactive</td>';
		// 		  } else {

		// 		  	statusHtml = '<td class=" act change">active</td>';
		// 		  }



		// 		  if(u.role === 1){
		// 		  	roleHtml = '<td class="user uchange">user</td>';
		// 		  } else {
		// 		  	roleHtml = '<td class="admin achange">admin</td>';
		// 		  }

		// 		  if(u.status === 1){ 
		// 		  	deleteHtml += '<a href="'+baseUrl+'" class="btn btn-danger delete" data-id="'+u._id +'">Delete</a>';
		// 		  }

		// 		  html += '<tr>'+
		// 		  	'<td>'+u.fname+'</td>'+
		// 		  	'<td>'+u.email+'</td>'+
		// 		  	'<td>'+u.date+'</td>'+
		// 		  	statusHtml + 
		// 		  	roleHtml+
		// 		 	'<td>'+
		// 		  	'<a href="'+baseUrl+'users/edit/'+ u._id + '" class="btn btn-info edit">Edit</a>'+
		// 		  	deleteHtml + 
		// 		  	'</td>'+
		// 		  	'</tr>';
		// 	  });

		// 	  $("#ajaxdata").html(html);
		// 	  }
	 //  }
	 //  })
  // }
  // // getUsers();

})