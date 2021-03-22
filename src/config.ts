export default {
    endpoint: '127.0.0.1',
    bandwidth: 500,
    capabilities:  {
        audio : {
            codecs		: ["opus"],
            extensions	: [ 
                "urn:ietf:params:rtp-hdrext:ssrc-audio-level", 
                "http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01"
            ]
        },
        video : {
            codecs		: ["h264"],
            rtx		:  true,
            rtcpfbs		: [
                { "id": "goog-remb"},
                { "id": "transport-cc"},
                { "id": "ccm", "params": ["fir"]},
                { "id": "nack"},
                { "id": "nack", "params": ["pli"]}
            ],
            extensions : [ 
                "urn:3gpp:video-orientation",
                "http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01",
                "http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time",
                "urn:ietf:params:rtp-hdrext:toffse",
                "urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id",
                "urn:ietf:params:rtp-hdrext:sdes:mid"
            ],
            simulcast : false
        }
    }
}
