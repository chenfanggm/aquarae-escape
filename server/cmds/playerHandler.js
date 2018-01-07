import arenaService from '../services/arenaService'


export default [{
  type: 'move',
  handler: (data) => {
    console.log('get move cmd:', data)
    arenaService.enqueueCmd(data)
  }
}]
