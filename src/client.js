import api from '@cocreate/api'

const CoCreateLinkedin = {
	name: 'linkedin',
	endPoints: {
		getLinkedinProfile: {},
		publishPost: {},
		updatePost: {},
		deletePost: {}
	},	
};

api.init(CoCreateLinkedin);