import api from '@cocreate/api'

const CoCreateLinkedin = {
	name: 'linkedin',
	actions: {
		getLinkedinProfile: {},
		publishPost: {},
		updatePost: {},
		deletePost: {}
	},	
};

api.init({
	name: CoCreateLinkedin.name, 
	component:	CoCreateLinkedin,
});