function Graph(host)
{ 
    this.host = host;
    this.PFVisualizer = new ParetoFrontVisualizer("chart");
}

Graph.method("onDataLoaded", function(claferXML, instancesXML){
    this.processor = new ClaferProcessor(claferXML);
    this.instanceProcessor = new InstanceProcessor(claferXML);     
});

Graph.method("onRendered", function()
{
	if (this.host.mdGoals.goals.length >= 2)
	{
		$("#chart").show();
		this.assignToAxis("dropPointX", this.host.mdGoals.goals[0].arg, this.host.mdGoals.goals[0].label);
		this.assignToAxis("dropPointY", this.host.mdGoals.goals[1].arg, this.host.mdGoals.goals[1].label);
        
        if (this.host.mdGoals.goals.length == 3)
        {
            assignToAxis("dropPointZ", this.host.mdGoals.goals[2].arg, this.host.mdGoals.goals[2].label);
        }
        else 
            assignToAxis("dropPointZ", "", "");
        
        this.redrawParetoFront();
	}
	else
		$("#chart").hide();

});

Graph.method("graphResize", function(e)
{
	this.redrawParetoFront();
	return true;
});

Graph.method("allowDrop", function(ev)
{
	ev.preventDefault();
});

Graph.method("drag", function(ev)
{
	ev.dataTransfer.setData("Text", ev.target.id + "|" + ev.target.className);
});

Graph.method("drop", function(ev)
{
	ev.preventDefault();

	var data = ev.dataTransfer.getData("Text");
	
	var parts = data.split("|");
	
	if (parts.length < 2)
		return;
	
	var arg = parts[0];
	var label = parts[1];

    var id = ev.target.id;
    var node = ev.target;
    
    while (node.parentNode != null && (id == "" || id == "svgcont"))
    {
        node = node.parentNode;
        id = node.id;
    }
    
	this.assignToAxis(id, arg, label, true);
    this.redrawParetoFront();
});

Graph.method("assignValue", function (id, value)
{
	if ($(id).length == 0)
		$('body').append('<input type="hidden" id="' + id + '" value=""/>');
	
	$('#' + id).val(value);
	
});

Graph.method("redrawParetoFront", function()
{
	var arg1 = $("#dropPointXAxisConfig_arg").val();
	var label1 = $("#dropPointXAxisConfig_label").val();

	var arg2 = $("#dropPointYAxisConfig_arg").val();
	var label2 = $("#dropPointYAxisConfig_label").val();

	var arg3 = $("#dropPointZAxisConfig_arg").val();
	var label3 = $("#dropPointZAxisConfig_label").val();
    
    var s = '<g style="z-index: 110; "><text text-anchor="middle" x="14.2" y="210.5" font-family="Arial" font-size="12" transform="rotate(-90 14.2 210.5)" stroke="none" stroke-width="0" fill="#222222">' + label2 + '</text></g>';
    s = '<div id="svgcont" style="position:relative; left:0;top:0; z-index:100; width:100%; height:100%;"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="z-index:101;" height="350">' + s + '</svg></div>';
        
    $("#dropPointX").html("<div>" + label1 + "</div>");
    $("#dropPointY").html(s);
    $("#dropPointZ").html("<div>" + label3 + "</div>");
        
    if (arg3 != "")
        this.PFVisualizer.draw(instanceProcessor, [arg1, arg2, arg3], [label1, label2, label3]);
    else
    	this.PFVisualizer.draw(instanceProcessor, [arg1, arg2], [label1, label2]);
});

Graph.method("assignToAxis", function(axis, arg, label)
{
	this.assignValue(axis + "AxisConfig_arg", arg);
	this.assignValue(axis + "AxisConfig_label", label);
});

Graph.method("getContent", function()
{
	var table = $('<table cellspacing="0" cellpadding="0" id="graph_table" width="100%" height="100%"></table>');
	
    var tdZ = $('<td colspan="2" id="dropPointZ" class="axis_drop"></td>');
    var tdY = $('<td height="90%" width="5%" id="dropPointY" class="axis_drop"></td>');
    var tdChart = $('<td id="chart" style="display:none; width:95%; height:95%"></td>');
    var tdX = $('<td colspan="2" id="dropPointX" class="axis_drop"></td>');

    var axisArray = new Array();
    axisArray.push(tdX);
    axisArray.push(tdY);
    axisArray.push(tdZ);
    
    for (var i = 0; i < axisArray.length; i++)
    {
        axisArray[i].html("&nbsp;");
        axisArray[i].ondrop = this.drop.bind(this);
        axisArray[i].ondragover = this.allowDrop.bind(this);
    }
    
    var row1 = $('<tr></tr>').append(tdZ);
    var row2 = $('<tr></tr>').append(tdY).append(tdChart);
    var row3 = $('<tr></tr>').append(tdX);
        
		
    table.append(row1);
    table.append(row2);
    table.append(row3);
		
	return table;	
    
});
