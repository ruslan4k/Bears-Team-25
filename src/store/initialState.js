const initialState = {
	service: {
		allServiceList: [
			"Mail",
			"Trello",
			"Github",
			"Facebook",
			"Twitter",
			"Instagram",
			"Slack"
		],
		serviceList: []
	},
	trigger: {
		Trello: [],
		Facebook: [],
		Twitter: [],
		Instagram: [],
		Github: [
			{
				heading: "Issue Raised in repo",
				content: "When an issue is raised in specified repo in github"
			}
		],
		Slack: [
			{
				heading: "Recieved a message",
				content: "When you get a DM from some specified username"
			}
		],
		Mail: [
			{
				heading: "Get a mail",
				content: "When you get a mail from some specified address"
			}
		]
	},
	action: {
		Mail: {
			Mail: [
				{
					heading: "Get a mail",
					content: "When you get a mail from some specified address"
				}
			]
		},
		Twitter: [],
		Facebook: [],
		Github: [],

		//The following section means that for action service "slack" and for trigger service "mail", we have the following card for applets
		//That is if you choose service "mail" in step1  and "slack" in step 3, then the action card would have this cards available
		Slack: {
			Mail: [
				{
					heading: "Send a mail",
					content: "When you get a mail from some specified address"
				}
			]
		},
		Trello: {
			Github: [
				{
					heading: "Make a card in trello",
					content:
						"Make a card in your trello board with some message"
				}
			]
		}
	},
	create: {
		appletList: []
	},
	activity: {
		activityList: []
	},
	applet: {
		appletList: [],
		myApplet: []
	}
};

export default initialState;
