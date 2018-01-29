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
	END_DAY: 5
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

	var queue = new EventQueue();
	var dayZero = new Event(EventType.BEGIN_DAY);
	dayZero.triggerTime = new Time(0, 23, 0);
	queue.enqueue(dayZero);
	var currentEvent = undefined;

	var truckCounter = 0;

	//Missing digestion of other events
	function digestBeginDay() {
		var endDay = new Event(EventType.END_DAY);
		endDay.triggerTime.copy(currentEvent.triggerTime);
		endDay.triggerTime.addMinutes(8.5 * 60);
		queue.enqueue(endDay);
		var nextTruckArrival = new Event(EventType.TRUCK_ARRIVAL);
		nextTruckArrival.triggerTime.copy(currentEvent.triggerTime);
		nextTruckArrival.triggerTime.addMinutes(probabilities.getTimeBetweenArrivals());
		nextTruckArrival.unloadingTime = probabilities.getUnloadingTime(teamSize);
		nextTruckArrival.truckNumber = truckCounter++;
		queue.enqueue(nextTruckArrival);
		console.log(queue.toString());
		digest();
	}

	function digest() {
		currentEvent = queue.dequeue();
		if (currentEvent == undefined) return;
		switch (currentEvent.eventType) {
			case EventType.BEGIN_DAY:
				digestBeginDay();
				break;
			case EventType.END_DAY:

			case EventType.BEGIN_UNLOAD:
			case EventType.BEGIN_LUNCHTIME:
			case EventType.BEGIN_DAY:
			case EventType.END_DAY:
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
