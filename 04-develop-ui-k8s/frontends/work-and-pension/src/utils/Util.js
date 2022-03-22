var Binding = {};
var ArrayUtil = {};
var Form = {};
var DateUtil = {};

Form.Mode = Object.freeze({
    NEW:	{name: "new"},
    LATEST: {name: "latest"},
    HISTORY:{name: "history"},
	NONE:	{name: "none"}
});

Form.ContractStatus = Object.freeze({
    ACTIVE:		{name: "active"},
    COMPLETED:	{name: "completed"},
    SUSPENDED:	{name: "suspended"},
	NONE:		{name: "none"}
});

DateUtil.timeConverter = function(UNIX_timestamp) {
	var unixtime = new Date(UNIX_timestamp * 1000);
	var year = unixtime.getFullYear();
	var month = unixtime.getMonth();
	var date = unixtime.getDate();
	var hour = unixtime.getHours();
	var min = unixtime.getMinutes();
	var sec = unixtime.getSeconds();
	var time = year + '.' + month + '.' + date + '. ' + hour + ':' + min + ':' + sec ;
	return time;
}

ArrayUtil.contains = function (array, obj) {
	var i = array.length;
	while (i--) {
		if (array[i] === obj) {
			return true;
		}
	}
	return false;
}

Binding.updateByString = function(o, path, value) {
	path = path.replace(/\[(\w+)\]/g, '.$1');
	path = path.replace(/^\./, '');
	var leaf = o;
	var nodes = path.split('.');
	for (var i = 0; i < nodes.length - 1; ++i) {
		var node = nodes[i];
		if (!(node in leaf) || !leaf[node]) {
			leaf[node] = {};
		}
		leaf = leaf[node];
	}
	leaf[nodes[nodes.length - 1]] = value;
	return o;
}

Binding.findByString = function(obj, path) {
	path = path.replace(/\[(\w+)\]/g, '.$1');
	path = path.replace(/^\./, '');
	var nodes = path.split('.');
	for (var i = 0; i < nodes.length; ++i) {
		var node = nodes[i];

		if (!!obj && node in obj) {
			obj = obj[node];
		} else {
			return;
		}
	}
	return obj;
}

export { Binding, ArrayUtil, Form, DateUtil }