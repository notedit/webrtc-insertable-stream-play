import { Response, Request, Router } from 'express'

import config from './config'

const apiRouter = Router()


const MediaServer = require("medooze-media-server")

const SemanticSDP = require('semantic-sdp')

const SDPInfo		= SemanticSDP.SDPInfo
const MediaInfo		= SemanticSDP.MediaInfo
const CandidateInfo	= SemanticSDP.CandidateInfo
const DTLSInfo		= SemanticSDP.DTLSInfo
const ICEInfo		= SemanticSDP.ICEInfo
const StreamInfo	= SemanticSDP.StreamInfo
const TrackInfo		= SemanticSDP.TrackInfo
const Direction		= SemanticSDP.Direction
const CodecInfo		= SemanticSDP.CodecInfo



MediaServer.enableDebug(true)
// MediaServer.enableUltraDebug(true)


const endpoint = MediaServer.createEndpoint(config.endpoint)

let incomingStream;

apiRouter.get('/test', async (req: Request, res: Response) => {
    res.send('hello world')
})

apiRouter.get('/', async (req: Request, res: Response) => {
    res.sendFile('index.html', { root: __dirname + '/../public'})
})

apiRouter.post('/rtc/v1/publish', async(req: Request, res: Response) => {

    const sdp = SDPInfo.process(req.body.sdp)

    console.log(req.body.sdp)

    const transport = endpoint.createTransport(sdp)
    transport.setRemoteProperties(sdp)


    const answer = sdp.answer({
        dtls    : transport.getLocalDTLSInfo(),
        ice		: transport.getLocalICEInfo(),
        candidates: endpoint.getLocalCandidates(),
        capabilities: config.capabilities
    })

    transport.setLocalProperties(answer)

    const offerStream = sdp.getFirstStream()

    console.dir(offerStream)

    incomingStream = transport.createIncomingStream(offerStream)

    res.json({
        sdp: answer.toString()
    })
})

apiRouter.post('/rtc/v1/play', async(req: Request, res: Response) => {

    const sdp = SDPInfo.process(req.body.sdp)

    const transport = endpoint.createTransport(sdp)
    transport.setRemoteProperties(sdp)

    const answer = sdp.answer({
        dtls    : transport.getLocalDTLSInfo(),
        ice		: transport.getLocalICEInfo(),
        candidates: endpoint.getLocalCandidates(),
        capabilities: config.capabilities
    })

    transport.setLocalProperties(answer)

    const outgoing = transport.createOutgoingStream({
        audio: true,
        video: true
    })

    outgoing.attachTo(incomingStream)
    answer.addStream(outgoing.getStreamInfo())

    res.json({
        sdp: answer.toString()
    })
    
})

export default apiRouter
