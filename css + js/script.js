function scrollh() {
	$(".smooth").on("scroll", function() {
		let scrollPos = $(this).scrollTop();
		$(".content").css({
			opacity: 1 - scrollPos / 400
		});

	});
}
scrollh();
