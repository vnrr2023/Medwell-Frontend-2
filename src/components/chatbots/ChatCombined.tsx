import Chat from './Chat'
import ChatArogya from './ChatArogya'
import ChatReport from './ChatReport'

export default function CombinedChat() {
return(
  <div>
    <Chat/>
    <ChatReport/>
    <ChatArogya/>
  </div>
)  
}
