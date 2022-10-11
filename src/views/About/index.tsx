import React from 'react'
import { observer } from 'mobx-react'
// import user from '@/store/user'  Because unplugin-auto-import is added, there is no need to manually import

function About() {
  const [pageTitle] = useState('defaultTitle') //Because unplugin-auto-import is added, there is no need to manually import

  return (
    <div>
      <h1>{pageTitle}</h1>
      <h2>{user.num}</h2>
      <button onClick={() => user.changeNum()}>Click To Change Numbers Using Mobx</button>
    </div>
  )
}

export default observer(About)
