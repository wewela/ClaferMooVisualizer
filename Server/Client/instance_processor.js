// Instance Processor is used to work with sets of configurations presented as XML

function InstanceProcessor (sourceXML) {
    this.source = sourceXML;
    this.xmlHelper = new XMLHelper();
}

// returns the number of instances in the set
InstanceProcessor.method("getInstanceCount", function() 
{
	var elements = this.source.getElementsByTagName("instance");
	if (elements == null)
		return 0;
		
	return elements.length;
});

// returns the base abstract clafer of all instances (they should have the same base abstract clafer)

InstanceProcessor.method("getInstanceSuperClafer", function() 
{
	try
	{
		var rootClafer = this.xmlHelper.queryXML(this.source, "/instances/instance/clafer/super[1]")[0].firstChild.nodeValue;
	}
	catch(e)
	{
		alert("Could not get a super clafer of the instance root");
		return "";
	}
	
	return rootClafer;
});


// returns feature value of featureName feature of an instance number instanceIndex
// forceNumeric forces to return an integer

InstanceProcessor.method("getFeatureValue", function(instanceIndex, featureName, forceNumeric) 
{
	try
	{
        var clafers = this.xmlHelper.queryXML(this.source, 'instances/instance[' + instanceIndex + ']' + '//clafer[@id="' + featureName + '"]');
		if (clafers.length == 1)
		{	
			var result;
			if (forceNumeric)
				result = 1;
			else
				result = "yes";			
		
			for (var i = 0; i < clafers[0].childNodes.length; i++)
			{
				var current = clafers[0].childNodes[i];

				if (current.tagName == "value")
				{
					if (current.firstChild)
					{
						result = current.firstChild.nodeValue;
						if (forceNumeric)
							result = parseInt(result);
					}
					
					break;
				}
			}
			
			return result;
		}
		else
        {
			if (forceNumeric)
				return 0;
			else
				return "-";			
        }
	}
	catch(e)
	{
		alert("Error while checking the feature specified by: '" + instanceIndex + " " + featureName + "'");
		return "";
	}
		
});