

# Operation Pip-Boy
---
## [Demo Video]()

## Synopsis
Operation Pip-Boy focuses on a modular plugin system and uses [Electron](http://electron.atom.io/) as an application wrapper.

## Team Members
* Dan McKinney
* Thor Denson

## What was used:
* Javascript Node
* JSON
* HTML?CSS
* Socket.io
* mocha
* express
* jQuery
* APIs: Google Maps, Openweathermap, RSS for New York Times, RSS for Drudge Report, RSS for BBC News. 

## Walkthrough
* sudo diskUtil list
* sudo diskUtil unmountDisk 
* /dev/disk2
* sudo dd
* if=~/Desktop/2018-04-18-raspbian-stretch.img
 of=/dev/rdisk2 bs=4096

## For setting up screen compatability with raspberry pi 
* cd ~
* wget 
* https://raw.githubusercontent.
* com/adafruit/Raspberry-Pi-Installer-
* Scripts/master/adafruit-pitft.sh
* chmod +x adafruit-pitft.sh
* sudo ./adafruit-pitft.sh

## Set up of screen
* $ sudo raspi-config
* set the country and enter SSI to wifi name
* configure the keyboard with the
* keyword layout
* $ reboot
* $ bash -c "$(curl -sL
* https://raw.githubusercontent.
* com/MichMich/MagicMirror
* /master/installers/raspberry.sh)"

* $ cd MagicMirror/
* $ npm install

* troubles with getting touch screen * responsiveness to work.
* Rolled back the update of Raspbian
* to March 2018

## To start Magic Mirror boot:
* DISPLAY=:0 npm start from the
* ~/MagicMirror directory to run
* magic mirror

## Using:
* FUSE for Mac & SSHFS to run 
* synchronous file editing from 
* VSCode to Pi
* run sshfs 
pi@10.150.40.206:/home/pi/MagicMirror ~/DigitalCrafts-2018-04/remotepi to re-establish the SSH connection 


## To debug:
 npm run config:check


### Home Screen
Here is the front image that users arrive at when launching the application
<p align='center'>
    <img src='images/home.png'></img>
</p>

### UI
As the landing page boots up, the different modules are populated and updated via socket.io by location.

### UX
The touch response allows the user to swipe left and right throught the use of the carousel module.


### Client Only

This is when you already have a server running remotely and want your RPi to connect as a standalone client to this instance, to show the MM from the server. Then from your RPi, you run it with: `node clientonly --address 192.168.1.5 --port 8080`. (Specify the ip address and port number of the server)

```javascript
var config = {
	address: "0.0.0.0",	// default is "localhost"
	port: 8080,		// default
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:172.17.0.1"], // default -- need to add your IP here
	...
};
```

## Challenges
<p align='center'>
    <img src='images/trello.png'></img>
</p>


## 
rpi  update to the new kernal and then 
## Group Hurdles
The dificulty 
<br>
<br>
### Thor

The biggest hurdle by far was the troubleshooting with the touchscreen. We updated the kernal and drivers for Raspbian. The next hurdle was the 3D printing. We couldnt seem to produce a decent print. The temperature wouldnt stay a constant number. Beyond that, the previous extruder was ruined so we had to replace it.
<br>
<br>
### Dan

<br>

### Layout & Positioning
The programs layout took some time to figure out since the css wasnt our own. the layout  but we are happy with the design. There was a lot of discussion on what to display in the two smaller standard responsive layouts. Did we want to show just the map? Did we want to show just a list? Would you be able to scroll even though it is our experience that on mobile scrolling on a map can be difficult. We ended up with a very pleasant design and layout that works for the UI & UX. 
### Newsfeed
This module displays news headlines based on an RSS feed. Scrolling through news headlines happens time-based (````updateInterval````), but can also be controlled by sending news feed specific notifications to the module.

#### Fetcher
 Responsible for requesting an update on the set interval and broadcasting the data.
 attribute url string - URL of the news feed.
 attribute reloadInterval number - Reload interval in milliseconds.

 ```var Fetcher = function(url, reloadInterval, encoding) {
	var self = this;
	if (reloadInterval < 1000) {
		reloadInterval = 1000;
	}

	var reloadTimer = null;
	var items = [];

	var fetchFailedCallback = function() {};
	var itemsReceivedCallback = function() {};

	/* private methods */

	/* fetchNews()
	 * Request the new items.
	 */

	var fetchNews = function() {
		clearTimeout(reloadTimer);
		reloadTimer = null;
		items = [];

		var parser = new FeedMe();

		parser.on("item", function(item) {

			var title = item.title;
			var description = item.description || item.summary || item.content || "";
			var pubdate = item.pubdate || item.published || item.updated || item["dc:date"];
			var url = item.url || item.link || "";

			if (title && pubdate) {

				var regex = /(<([^>]+)>)/ig;
				description = description.toString().replace(regex, "");

				items.push({
					title: title,
					description: description,
					pubdate: pubdate,
					url: url,
				});

			} else {
				console.log("Can't parse feed item:");
				console.log(item);
				console.log("Title: " + title);
				console.log("Description: " + description);
				console.log("Pubdate: " + pubdate);
			}
		});

		parser.on("end",	function() {
			//console.log("end parsing - " + url);
			self.broadcastItems();
			scheduleTimer();
		});

		parser.on("error", function(error) {
			fetchFailedCallback(self, error);
			scheduleTimer();
		});


		nodeVersion = Number(process.version.match(/^v(\d+\.\d+)/)[1]);
		headers =	{"User-Agent": "Mozilla/5.0 (Node.js "+ nodeVersion + ") MagicMirror/"	+ global.version +	" (https://github.com/MichMich/MagicMirror/)",
			"Cache-Control": "max-age=0, no-cache, no-store, must-revalidate",
			"Pragma": "no-cache"}

		request({uri: url, encoding: null, headers: headers})
			.on("error", function(error) {
				fetchFailedCallback(self, error);
				scheduleTimer();
			})
			.pipe(iconv.decodeStream(encoding)).pipe(parser);

	};```



### The clock module is one of the modules we have added into the default programs.
This module displays the current date and time. The information will be updated realtime.
 Below is some of the code:

```	// Define required scripts.
	getScripts: function() {
		return ["moment.js", "moment-timezone.js"];
	},
	// Define styles.
	getStyles: function() {
		return ["clock_styles.css"];
	},
	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);

		// Schedule update interval.
		var self = this;
		setInterval(function() {
			self.updateDom();
		}, 1000);

		// Set locale.
		moment.locale(config.language);

	},
	// Override dom generator.
	getDom: function() {

		var wrapper = document.createElement("div");

		/************************************
		 * Create wrappers for DIGITAL clock
		 */

		var dateWrapper = document.createElement("div");
		var timeWrapper = document.createElement("div");
		var secondsWrapper = document.createElement("sup");
		var periodWrapper = document.createElement("span");
		var weekWrapper = document.createElement("div")
		// Style Wrappers
		dateWrapper.className = "date normal medium";
		timeWrapper.className = "time bright large light";
		secondsWrapper.className = "dimmed";
		weekWrapper.className = "week dimmed medium"

		// Set content of wrappers.
		// The moment().format("h") method has a bug on the Raspberry Pi.
		// So we need to generate the timestring manually.
		var timeString;
		var now = moment();
		if (this.config.timezone) {
			now.tz(this.config.timezone);
		}

		var hourSymbol = "HH";
		if (this.config.timeFormat !== 24) {
			hourSymbol = "h";
		}

		if (this.config.clockBold === true) {
			timeString = now.format(hourSymbol + "[<span class=\"bold\">]mm[</span>]");
		} else {
			timeString = now.format(hourSymbol + ":mm");
		}

		if(this.config.showDate){
			dateWrapper.innerHTML = now.format(this.config.dateFormat);
		}
		if (this.config.showWeek) {
			weekWrapper.innerHTML = this.translate("WEEK", { weekNumber: now.week() });
		}
		timeWrapper.innerHTML = timeString;
		secondsWrapper.innerHTML = now.format("ss");
		if (this.config.showPeriodUpper) {
			periodWrapper.innerHTML = now.format("A");
		} else {
			periodWrapper.innerHTML = now.format("a");
		}
		if (this.config.displaySeconds) {
			timeWrapper.appendChild(secondsWrapper);
		}
		if (this.config.showPeriod && this.config.timeFormat !== 24) {
			timeWrapper.appendChild(periodWrapper);
		}```
</p>

### Future Features

Listed below are some features that we would love to include in the next update:
-Smart Watch includes accelerometer to track steps using x, y, z axial tilt
-Interactive with other bluetooth devices.
-Cat videos displayed on screen
-Customizability of watch face: Dark, light, hacker, pip-boy
-speaker and amplifier attached to raspberry pi 
-send request from touch event
<!-- -phone bluetooth to determine custom settings -->