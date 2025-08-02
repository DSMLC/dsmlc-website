"use client";

import React, { useEffect, useState } from "react";
import supabase from "../supabase_client";

interface Member {
    first_name: string;
}

const MembersList: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);

    useEffect(() => {
        const fetchMembers = async () => {
            const { data } = await supabase
                .schema("admin")
                .from("Member")
                .select("first_name");

            setMembers(data || []);
        };

        fetchMembers();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Club Members
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {members.map((member, index) => (
                    <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                        <p className="text-gray-800 font-medium">
                            {member.first_name}
                        </p>
                    </div>
                ))}
            </div>
            <div className="mt-4 text-sm text-gray-500">
                Total members: {members.length}
            </div>
        </div>
    );
};

export default MembersList;
