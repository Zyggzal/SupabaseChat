import PromoteMemberButton from "@/components/chatroomSettings/buttons/promoteMemberButton";
import RoundedImage from "@/components/roundedImage/roundedImage";
import { ChatroomMember } from "@/types/chat";
import RemoveMemberButton from "../buttons/removeMemberButton";

export default function ChatroomMembersListItem({ member, self, editable } : { 
    member: ChatroomMember, 
    self?: boolean,
    editable?: boolean
}) {
    return <div className={`flex justify-between items-center w-full h-max py-3 px-5 hover:bg-orange-300 hover:shadow-md hover:shadow-orange-500 bg-gray-300 ${self && 'bg-orange-200'}`}>
        <div className="flex items-center">
            <RoundedImage
                src={member.profile.image_url || '/images/no-pfp.jpg'}
                alt="chatroom member avatar"
                className="w-15 h-15 mr-5 shadow-lg"
                />
                <div>
                    <h3 className="text-orange-500 font-bold">{member.profile.name}</h3>
                    <p className="text-white ms-1">{member.role}</p>
                </div>
        </div>
        {
            editable && member.role !== 'creator' && <div className="flex gap-x-5">
                <PromoteMemberButton member={member}/>
                <RemoveMemberButton member={member}/>
            </div>
        }
    </div>
}