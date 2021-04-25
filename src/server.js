'use strict'
const api = require('@cocreate/api');
const LinkedInRestClient = require("./LinkedInRestClient");

class CoCreateLinkedin {

    constructor(wsManager) {
        this.wsManager = wsManager;
        this.module_id = "linkedin";
        this.init();
        this.enviroment = 'test';
        this.LINKEDIN_CLIENT_ID = null;
        this.LINKEDIN_CLIENT_SECRET = null;
        this.CALL_BACK_URL = null;
        this.ACCESS_TOKEN = null;
    }

    init() {
        if (this.wsManager) {
            this.wsManager.on(this.module_id, (socket, data) => this.sendLinkedin(socket, data));
        }
    }

    async sendLinkedin(socket, data) {
        console.log(" sendLinkedin ")
        const type = data['type'];
        const params = data['data'];
        
        try{
                let enviroment = typeof params['enviroment'] != 'undefined' ? params['enviroment'] : this.enviroment;
                let org_row = await api.getOrg(params,this.module_id);
                this.LINKEDIN_CLIENT_ID = org_row['apis.'+this.module_id+'.'+enviroment+'.LINKEDIN_CLIENT_ID'];
                this.LINKEDIN_CLIENT_SECRET = org_row['apis.'+this.module_id+'.'+enviroment+'.LINKEDIN_CLIENT_SECRET'];
                this.CALL_BACK_URL = org_row['apis.'+this.module_id+'.'+enviroment+'.CALL_BACK_URL'];
                this.ACCESS_TOKEN = org_row['apis.'+this.module_id+'.'+enviroment+'.ACCESS_TOKEN'];
      	 }catch(e){
      	   	console.log(this.module_id+" : Error Connect to api",e)
      	   	return false;
      	 }
      
        const linkedinRes = new LinkedInRestClient(this.LINKEDIN_CLIENT_ID, this.LINKEDIN_CLIENT_SECRET, this.CALL_BACK_URL);
        switch (type) {
            case 'getLinkedinProfile':
                this.getLinkedinProfile(socket, type, linkedinRes);
                break;
            case 'publishPost':
                this.publishPost(socket, type, data, linkedinRes);
                break;
            case 'deletePost':
                this.deletePost(socket, type, data, linkedinRes);
                break;
        }
    }

    async getLinkedinProfile(socket, type, linkedinRes) {
        const profile = await linkedinRes.getCurrentMemberProfile(['id', 'firstName', 'lastName', 'profilePicture'], this.ACCESS_TOKEN);
        const imageInfo = profile.profilePicture.displayImage;
        const imageInfoArr = imageInfo.split(":");
        profile.profilePicture.displayImage = imageInfoArr[3];
        const response = {
            'object': 'list',
            'data': [profile],
        };
        api.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id)
    }

    async publishPost(socket, type, data, linkedinRes) {
        const reqData = data.data;
        const linkedinId = reqData.id;
        const postData = {
            content: {
                contentEntities: [
                    {
                        entityLocation: "https://www.example.com/content.html",
                        thumbnails: [
                            {
                                "resolvedUrl": "https://www.example.com/image.jpg"
                            }
                        ]
                    }
                ],
                title: reqData.title
            },
            distribution: {
                linkedInDistributionTarget: {}
            },
            owner: "urn:li:person:"+linkedinId,
            subject: reqData.title,
            text: {
                text: reqData.content
            }
        };
        const responseData = await linkedinRes.publishContent(linkedinId, postData, this.ACCESS_TOKEN);
        const response = {
            'object': 'list',
            'data': [responseData],
        };
        api.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id);
    }
    
    async updatePost(socket, type, data, linkedinRes) {
        const reqData = data.data;
        const linkedinId = reqData.id;
        const updateData = {
            patch: {
                $set: {
                    text: {
                        annotations: [],
                        text: "Edit my share!"
                    }
                }
            }
        };
        const responseData = await linkedinRes.updatePost(linkedinId, updateData, this.ACCESS_TOKEN);
        api.send_response(this.wsManager, socket, { "type": type, "response": responseData }, this.module_id);
    }
    
    async deletePost(socket, type, data, linkedinRes) {
        const reqData = data.data;
        const linkedinId = reqData.id;
        const responseData = await linkedinRes.deletePost(linkedinId, this.ACCESS_TOKEN);
        const response = {
            'object': 'list',
            'data': [{'status':responseData}],
        };
        api.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id);
    }

}

module.exports = CoCreateLinkedin;
