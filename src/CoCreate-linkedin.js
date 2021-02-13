const CoCreateLinkedin = {
	id: 'linkedin',
	actions: [
		'getLinkedinProfile',
		'publishPost',
		'deletePost'
	],
	
	action_getLinkedinProfile: function(element, data) {
	    let container = document;
		let form_data = CoCreateApi.getFormData('linkedin', 'getLinkedinProfile',  container);
		console.log(form_data);
		CoCreateApi.send('linkedin', 'getLinkedinProfile', form_data);
		console.log(data);
	},
	
	action_publishPost: function(element, data) {
	    let container = document;
		let form_data = CoCreateApi.getFormData('linkedin', 'publishPost',  container);
		CoCreateApi.send('linkedin', 'publishPost', form_data);
		console.log(data);
	},
	
	action_updatePost: function(element, data) {
	    let container = document;
		let form_data = CoCreateApi.getFormData('linkedin', 'updatePost',  container);
		CoCreateApi.send('linkedin', 'updatePost', form_data);
		console.log(data);
	},
	
	action_deletePost: function(element, data) {
	    let container = document;
		let form_data = CoCreateApi.getFormData('linkedin', 'deletePost',  container);
		CoCreateApi.send('linkedin', 'deletePost', form_data);
		console.log(data);
	}
	
};

CoCreate.api.init({
	name: CoCreateLinkedin.id, 
	module:	CoCreateLinkedin,
});