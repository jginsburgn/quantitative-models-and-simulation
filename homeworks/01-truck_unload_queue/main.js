const NOT_AS_CONSTRUCTOR_ERROR = "Constructor not called with keyword new.";
const UNKNOWN_SIGNATURE = "Routine called with an unknown number of arguments.";
const TYPE_MISMATCH = "Type mismatch.";

function Time(days, hours, minutes) {
	if (!new.target) throw new Error(NOT_AS_CONSTRUCTOR_ERROR);
	if (arguments.length != 3) throw new Error(UNKNOWN_SIGNATURE);
	this.days = 0;
	this.hours = 0;
	this.minutes = 0;
	var totalMinutes = minutes + hours * 60 + days * 24 * 60;
	this.addMinutes(totalMinutes);
}

Time.prototype = {
	addMinutes: function(minutes) {
		minutes = this.toMinutes() + minutes;
		this.days = Math.floor(minutes / (60 * 24));
		minutes = minutes % (60 * 24);
		this.hours = Math.floor(minutes / 60);
		minutes %= 60;
		this.minutes = minutes;
	},
	addHours: function(hours) {
		this.addMinutes(hours * 60);
	},
	addDays: function(days) {
		this.addHours(days * 24);
	},
	toMinutes: function() {
		return this.days * 24 * 60 + this.hours * 60 + this.minutes;
	},
	toString: function() {
		return `${this.days}, ${this.hours}:${this.minutes}`;
	},
	copy: function(from) {
		this.days = from.days;
		this.hours = from.hours;
		this.minutes = from.minutes;
	}
};

Time.lessThan = function(timeA, timeB) {
	return timeA.toMinutes() < timeB.toMinutes();
}

Time.equalTo = function(timeA, timeB) {
	return timeA.toMinutes() == timeB.toMinutes();
}

var EventType = Object.freeze({
	UNDEFINED: 0,
	TRUCK_ARRIVAL: 1,
	BEGIN_UNLOAD: 2,
	BEGIN_LUNCHTIME: 3,
	BEGIN_DAY: 4,
	END_DAY: 5,
	END_UNLOAD: 6
});

function getEventTypeString(eventType) {
	for (var prop in EventType) {
		if (eventType == EventType[prop]) return prop;
	}
	return undefined;
}

function Event(newEventType) {
	if (!new.target) throw new Error(NOT_AS_CONSTRUCTOR_ERROR);
	this.eventType = newEventType;
	this._triggerTime = new Time(0, 0, 0);
}

Object.defineProperty(Event.prototype, "triggerTime", {
	enumerable: false,
	get: function() {
		return this._triggerTime;
	},
	set: function(newTriggerTime) {
		if (!(newTriggerTime instanceof Time)) throw new Error(TYPE_MISMATCH);
		this._triggerTime = newTriggerTime;
	}
});

Object.defineProperty(Event.prototype, "toString", {
	enumerable: false,
	value: function() {
		var retVal = `${getEventTypeString(this.eventType)} at day ${this.triggerTime.toString()}`;
		for (var prop in this) {
			if (prop != "eventType" && prop != "_triggerTime") {
				retVal += `\n\t ${prop}: ${this[prop]}`;
			}
		}
		return retVal;
	}
});

function EventQueue() {
	if (!new.target) throw new Error(NOT_AS_CONSTRUCTOR_ERROR);
	this.eventList = [];
}

EventQueue.prototype = {
	enqueue: function(event) {
		if (!(event instanceof Event)) throw new Error(TYPE_MISMATCH);
		var inserted = false;
		for (var i = this.eventList.length - 1; i >= 0; --i) {
			var currentEvent = this.eventList[i];
			if (Time.lessThan(event.triggerTime, currentEvent.triggerTime)) continue;
			else {
				this.eventList.splice(i + 1, 0, event);
				inserted = true;
				break;
			}
		}
		if (!inserted) this.eventList.splice(0, 0, event);
	},
	dequeue: function() {
		if (this.eventList.length <= 0) return undefined;
		return this.eventList.splice(0, 1)[0];
	},
	toString: function() {
		console.log("Event Queue >");
		for (var i = this.eventList.length - 1; i >= 0; i--) {
			var currentEvent = this.eventList[i];
			console.log(currentEvent.toString());
		}
		console.log("Event Queue <");
	}
};

// Missing real probability functions
var probabilities = {
	getRandomNumber: function() {
		return Math.random();
	},
	getTimeBetweenArrivals: function() {
		return 40;
	},
	getUnloadingTime: function(teamSize) {
		return 20;
	}
};

function digester(teamSize) {
	// Global main variables
	var queue = new EventQueue();

	// Global aid variables
	var currentEvent = undefined;
	var isTeamBusy = false;
	var truckCounter = 0;

	// Enqueue initial events
	var dayZero = new Event(EventType.BEGIN_DAY);
	dayZero.triggerTime = new Time(0, 23, 0);
	queue.enqueue(dayZero);

	function getNextOpenUnloadingSlot() {

	}

	function getNextUnloadingEnd() {

	}

	function postponeNextUnloadingsByMinutes(minutes) {

	}

	function digestTruckArrival() {
		console.log(`Begin digestion of truck arrival: ${currentEvent.toString()}.`);

		// Enqueue next truck arrival
		var nextTruckArrival = new Event(EventType.TRUCK_ARRIVAL);
		nextTruckArrival.copy(currentEvent.triggerTime);
		nextTruckArrival.triggerTime.addMinutes(probabilities.getTimeBetweenArrivals());
		nextTruckArrival.unloadingTime = probabilities.getUnloadingTime(teamSize);
		nextTruckArrival.truckNumber = truckCounter++;
		queue.enqueue(nextTruckArrival);

		// Enqueue current truck unloading after latest truck unloading
		var thisTruckUnloading = new Event(EventType.BEGIN_UNLOAD);
		thisTruckUnloading.unloadingTime = currentEvent.unloadingTime;
		thisTruckUnloading.truckNumber = currentEvent.truckNumber;
		thisTruckUnloading.copy(getNextOpenUnloadingSlot());
		queue.enqueue(thisTruckUnloading);

		// Continue digesting
		digest();
	}

	function digestBeginUnload() {
		console.log(`Begin digestion of truck unloading: ${currentEvent.toString()}.`);

		// Make team busy
		isTeamBusy = true;

		// Enqueue end unload
		var endUnload = new Event(EventType.BEGIN_UNLOAD);
		endUnload.copy(currentEvent.triggerTime);
		endUnload.triggerTime.addMinutes(currentEvent.unloadingTime);
		endUnload.truckNumber = currentEvent.truckNumber;
		queue.enqueue(endUnload);

		// Record finances

		// Continue digesting
		digest();
	}

	function digestBeginLunchtime() {
		console.log(`Begin digestion of begin lunchtime: ${currentEvent.toString()}.`);

		// Check if lunch must happen or if team is in leisure; if so, digest.
		if (!isTeamBusy || currentEvent.postponed) return digest();
		// If team is busy and lunch has not been postponed, postpone it once
		currentEvent.postponed = true;
		currentEvent.triggerTime.copy(getNextUnloadingEnd());
		postponeNextUnloadingsByMinutes(30);
		queue.enqueue(currentEvent);

		// Continue digesting
		digest();
	}

	function digestBeginDay() {
		console.log(`Begin digestion of begin day: ${currentEvent.toString()}.`);

		// Enqueue day end
		var endDay = new Event(EventType.END_DAY);
		endDay.triggerTime.copy(currentEvent.triggerTime);
		endDay.triggerTime.addMinutes(8.5 * 60);
		queue.enqueue(endDay);

		// Enqueue lunchtime
		var lunchTime = new Event(EventType.BEGIN_LUNCHTIME);
		lunchTime.postponed = false;
		lunchTime.triggerTime.copy(currentEvent.triggerTime);
		lunchTime.triggerTime.addMinutes(240);
		queue.enqueue(lunchTime);

		// Continue digesting
		digest();
	}

	function digestEndDay() {
		console.log(`Begin digestion of day end: ${currentEvent.toString()}.`);

		// Enqueue day begin

		// Postpone all non currently unloading trucks for tomorrow

		//Continue digesting
		digest();
	}

	function digestEndUnload() {
		console.log(`Begin digestion of unloading end: ${currentEvent.toString()}.`);
	}

	function digest() {
		currentEvent = queue.dequeue();
		if (currentEvent == undefined) return;
		switch (currentEvent.eventType) {
			case EventType.UNDEFINED:
				throw new Error("Event was undefined.");
				break;
			case EventType.TRUCK_ARRIVAL:
				digestTruckArrival();
				break;
			case EventType.BEGIN_UNLOAD:
				digestBeginUnload();
				break;
			case EventType.BEGIN_LUNCHTIME:
				digestBeginLunchtime();
				break;
			case EventType.BEGIN_DAY:
				digestBeginDay();
				break;
			case EventType.END_DAY:
				digestEndDay();
				break;
			case EventType.END_UNLOAD:
				digestEndUnload();
				break;
		}
	}

	digest();
}

function test() {
	var a = new Event(EventType.BEGIN_DAY);
	a.triggerTime = new Time(0, 0, 0);
	var b = new Event(EventType.END_DAY);
	b.triggerTime = new Time(0, 23, 59);
	var q = new EventQueue();
	q.enqueue(b);
	q.toString();
	q.enqueue(a);
	q.toString();
}

//test();
digester();
