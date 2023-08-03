'use strict'
const api = require('@cocreate/api');
const LinkedInRestClient = require("./LinkedInRestClient");

class CoCreateLinkedin {

    constructor(wsManager) {
        this.wsManager = wsManager;
        this.name = "linkedin";
        this.init();
        this.LINKEDIN_CLIENT_ID = null;
        this.LINKEDIN_CLIENT_SECRET = null;
        this.CALL_BACK_URL = null;
        this.ACCESS_TOKEN = null;
    }

    init() {
        if (this.wsManager) {
            this.wsManager.on(this.name, (socket, data) => this.sendLinkedin(socket, data));
        }
    }

    async sendLinkedin(socket, data) {
        let params = data['data'];
        let environment;
        let action = data['action'];
        let linkedin = false;

        try {
            let org = await api.getOrg(data, this.name);
            if (params.environment) {
                environment = params['environment'];
                delete params['environment'];
            } else {
                environment = org.apis[this.name].environment;
            }
            this.LINKEDIN_CLIENT_ID = org.apis[this.name][environment].LINKEDIN_CLIENT_ID;
            this.LINKEDIN_CLIENT_SECRET = org.apis[this.name][environment].LINKEDIN_CLIENT_SECRET;
            this.CALL_BACK_URL = org.apis[this.name][environment].CALL_BACK_URL;
            this.ACCESS_TOKEN = org.apis[this.name][environment].ACCESS_TOKEN;
            linkedin = new LinkedInRestClient(this.LINKEDIN_CLIENT_ID, this.LINKEDIN_CLIENT_SECRET, this.CALL_BACK_URL);
        } catch (e) {
            console.log(this.name + " : Error Connect to api", e)
            return false;
        }

        try {
            let response
            switch (action) {
                case 'getLinkedinProfile':
                    response = this.getLinkedinProfile(socket, action, linkedin);
                    break;
                case 'publishPost':
                    response = this.publishPost(socket, action, data, linkedin);
                    break;
                case 'deletePost':
                    response = this.deletePost(socket, action, data, linkedin);
                    break;
            }
            this.wsManager.send(socket, { method: this.name, action, response })

        } catch (error) {
            this.handleError(socket, action, error)
        }
    }

    handleError(socket, action, error) {
        const response = {
            'object': 'error',
            'data': error || error.response || error.response.data || error.response.body || error.message || error,
        };
        this.wsManager.send(socket, { method: this.name, action, response })
    }


    async getLinkedinProfile() {
        const profile = await linkedin.getCurrentMemberProfile(['id', 'firstName', 'lastName', 'profilePicture'], this.ACCESS_TOKEN);
        const imageInfo = profile.profilePicture.displayImage;
        const imageInfoArr = imageInfo.split(":");
        profile.profilePicture.displayImage = imageInfoArr[3];
        const response = {
            'object': 'list',
            'data': [profile],
        };
        return response
    }

    async publishPost(data) {
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
            owner: "urn:li:person:" + linkedinId,
            subject: reqData.title,
            text: {
                text: reqData.content
            }
        };
        const responseData = await linkedin.publishContent(linkedinId, postData, this.ACCESS_TOKEN);
        const response = {
            'object': 'list',
            'data': [responseData],
        };
        return response
    }

    async updatePost(data) {
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
        const responseData = await linkedin.updatePost(linkedinId, updateData, this.ACCESS_TOKEN);
        return response
    }

    async deletePost(data) {
        const reqData = data.data;
        const linkedinId = reqData.id;
        const responseData = await linkedin.deletePost(linkedinId, this.ACCESS_TOKEN);
        const response = {
            'object': 'list',
            'data': [{ 'status': responseData }],
        };
        return response
    }

}

module.exports = CoCreateLinkedin;
