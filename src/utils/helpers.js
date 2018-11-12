export function obj2arr( obj ) {
  return Object.keys(obj).map(i => obj[i])
}

export function arr2obj( array ) {

}

export function formatDate(timestamp, convert) {
  let date = timestamp
  if ( convert ) {
    let dateString = timestamp.toString()
    let year = dateString.substr(0,4)
    let mth = dateString.substr(4,2)
    let day = dateString.substr(6,)
    date = year + '-' + mth + '-' + day
  }
	const d = new Date(date)
	const time = d.toLocaleTimeString('en-US')
	return `${time.substr(0, 5) + time.slice(-2)} | ${d.toLocaleDateString()}`
}