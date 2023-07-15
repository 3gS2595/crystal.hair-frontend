export const ContentService = {
  getContent (params: any) {
    return fetch('http://192.168.1.180:3000/' + params).then((res) =>
      res.json()
    )
  },
  generateColumns (args: any) {
    const params = args[0]
    const returnJson = [] as any[]
    const returnJsonSelected = []
    console.log(args)
    if (args[0] !== undefined) {
      if (args[0].length > 0) {
        console.log(args[0])
        // insert priorities
        for (let x = 0; x < args[1].length; x++) {
          priorityInsert(args[1][x])
        }
        for (let i = 0; i < Object.keys(params[0]).length; i++) {
          // raw field title
          const key = Object.keys(params[0])[i]

          // preexisting prioritized entry push check
          let flag = false
          for (let n = 0; n < Object.keys(returnJson).length; n++) {
            if (returnJson[n].field === key) {
              console.log('test')
              flag = true
            }
          }
          // dynamic push remaining columns
          // excluding api autogen
          if (key !== 'id' && key !== 'created_at' && key !== 'updated_at' && !flag) {
            returnJson.push({
              field: key,
              header: key
            })
          }
        }

        function priorityInsert (filt: any) {
          const preKey = Object.keys(params[0])
          if (preKey.indexOf(filt) > -1) {
            const index = preKey.indexOf(filt)
            returnJson.push({
              field: preKey[index],
              header: preKey[index]
            })
          }
        }
        return returnJson
      }
    } else {
      return []
    }
  }
}
