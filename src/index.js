const CoCreateLinkedin = {
	id: 'linkedin',
	actions: [
		'getLinkedinProfile',
		'publishPost',
		'deletePost'
	],
	
	action_getLinkedinProfile: function(element, data) {
	    let container = document;
		let form_data = CoCreate.api.getFormData('linkedin', 'getLinkedinProfile',  container);
		console.log(form_data);
		CoCreate.api.send('linkedin', 'getLinkedinProfile', form_data);
		console.log(data);
	},
	
	action_publishPost: function(element, data) {
	    let container = document;
		let form_data = CoCreate.api.getFormData('linkedin', 'publishPost',  container);
		CoCreate.api.send('linkedin', 'publishPost', form_data);
		console.log(data);
	},
	
	action_updatePost: function(element, data) {
	    let container = document;
		let form_data = CoCreate.api.getFormData('linkedin', 'updatePost',  container);
		CoCreate.api.send('linkedin', 'updatePost', form_data);
		console.log(data);
	},
	
	action_deletePost: function(element, data) {
	    let container = document;
		let form_data = CoCreate.api.getFormData('linkedin', 'deletePost',  container);
		CoCreate.api.send('linkedin', 'deletePost', form_data);
		console.log(data);
	}
	
};

api.init({
	name: CoCreateLinkedin.id, 
	module:	CoCreateLinkedin,
});