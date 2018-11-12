export function obj2arr( obj ) {
  return Object.keys(obj).map(i => obj[i])
}

export function arr2obj( array ) {
  return array.reduce((acc, cur, i) => {
    acc[i] = cur
    return acc
  })
}

export function formatDate(timestamp, convert = false) {
  let date = timestamp
  // if converting from YYYYMMDD format, else it's a UNIX timestamp
  if ( convert ) {
    let dateString = timestamp.toString()
    let year = dateString.substr(0,4)
    let mth = dateString.substr(4,2)
    let day = dateString.substr(6,)
    date = year + '-' + mth + '-' + day
  }
	const d = new Date(date)
  // const time = d.toLocaleTimeString('en-US')
	// return `${time.substr(0, 5) + time.slice(-2)} | ${d.toLocaleDateString()}`
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}