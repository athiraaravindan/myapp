$(function){
	$(document).on("click", ".edit", function(e){
		e.preventDefault();
		var thisObj = this;
		var id = $(this).data("id");

		$.ajax({
			url: baseUrl+'users/edit',
			type: 'POST',
			data: { id: id },
			dataType: 'JSON',
			success: function (data) {
				
				

			},
			error: function () {

			}
		})
	})
}