Module.register("MMM-randomMeme",{
	defaults: {
		opacity: 0.3,
		animationSpeed: 600,
		updateInterval: 60,
		url: 'https://www.memecenter.com/'
	},

	start: function() {
		this.load();
	},

	load: function() {
		var self = this;

		var url = self.config.url + (self.config.url.indexOf('?') > -1 ? '&' : '?') + (new Date().getTime());
		var img = $('<img />').attr('src', url);

		img.on('load', function() {
				$('#mmm-meme-placeholder1').attr('src', url).animate({
					opacity: self.config.opacity
				}, self.config.animationSpeed, function() {
					$(this).attr('id', 'mmm-meme-placeholder2');
				});

				$('#mmm-meme-placeholder2').animate({
					opacity: 0
				}, self.config.animationSpeed, function() {
					$(this).attr('id', 'mmm-meme-placeholder1');
				});
		});

		setTimeout(function() {
			self.load();
		}, (self.config.updateInterval * 1000));
		
	},

	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.innerHTML = '<img id="mmm-meme-placeholder1" style="opacity: 0; position: absolute" /><img id="mmm-meme-placeholder2" style="opacity: 0; position: absolute" />';
		return wrapper;
	},
	getScripts: function() {
    return [
			this.file('node_modules/jquery/dist/jquery.min.js')
    ]
	}
});