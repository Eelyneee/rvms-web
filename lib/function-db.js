import { supabaseClient, supabaseAdmin } from "./client";
import { useState } from "react";
import bcrypt from "bcryptjs";

/**
 * 
 * @param {*} accID 
 * @returns 
 */
const getAdminstratorByID = async (accID) => {

    let { data, error } = await supabaseClient
        .from('administrators')
        .select('*,accounts(email))')
        .eq('account_id', accID)
    return { administrator: data[0], error }
}

/**
 * 
 * @returns 
 */
const getAllAdministrator = async () => {

    let { data: administrators, error } = await supabaseClient
        .from('administrators')
        .select('*')
        .range(0, 9)

    return { administrators, error };
}

/**
 * 
 * @returns 
 */
const getAllSecurityGuard = async () => {

    let { data: security_guards, error } = await supabaseClient
        .from('security_guards')
        .select('*')
        .range(0, 9)

    return { security_guards, error }
}

/**
 * 
 * @returns 
 */
const getManagementAccountData = async () => {

    let { data: accounts, error } = await supabaseClient
        .from('accounts')
        .select('*').eq('account_type', 'management')
    return { accounts, error }
}

/**
 * 
 * @returns 
 */
const getSGAccountData = async () => {

    let { data: accounts, error } = await supabaseClient
        .from('accounts')
        .select('*').eq('account_type', 'security_guard')
    return { accounts, error }
}

/**
 * 
 * @returns 
 */
const getResidentAccountData = async () => {

    let { data: accounts, error } = await supabaseClient
        .from('accounts')
        .select('*').eq('account_type', 'resident')
    return { accounts, error }
}


const getResidentByID = async (residentID) => {
    let { data, error } = await supabaseClient
        .from('residents')
        .select('*')
        .eq('account_id', residentID)
    return { residents: data[0], error }
}

const getFeedbackByID = async (feedback_id) => {

    let { data, error } = await supabaseClient
        .from('feedbacks')
        .select('*')
        .eq('id', feedback_id)
    return { feedbacks: data[0], error }
}

/**
 * 
 * @returns 
 */
const getPendingResidentRegistration = async () => {

    let { data: residents_registration, error } = await supabaseClient
        .from('residents_registration')
        .select('*')
        .eq('status', 'pending')
        .range(0, 9)
    return { residents_registration, error }
}

/**
 * 
 * @returns 
 */
const getApprovedResidentRegistration = async () => {

    let { data: residents_registration, error } = await supabaseClient
        .from('residents_registration')
        .select('*')
        .eq('status', 'approved')
    return { residents_registration, error }
}

/**
 * 
 * @returns 
 */
const getAllResident = async () => {

    let { data: residents, error } = await supabaseClient
        .from('residents')
        .select('*')
    return { residents, error }
}

const getAllApprovedResident = async () => {

    let { data: residents, error } = await supabaseClient
        .from('residents')
        .select('*,residents_registration!inner(status)')
        .eq('residents_registration.status', 'approved')
    return { residents, error }
}

/**
 * 
 * @returns 
 */
const getHouseUnit = async () => {

    let { data: house_unit, error } = await supabaseClient
        .from('house_unit')
        .select('*')
    return { house_unit, error };
}

/**
 * 
 */
const getTodayVisitation = async (today) => {

    let { data: visitation, error } = await supabaseClient
        .from('visitation')
        .select('*')
        .eq('visitation_date', today)
    return { visitation, error }

}

/**
 * 
 * @returns 
 */
const getAllVisitation = async () => {

    let { data: visitation, error } = await supabaseClient
        .from('visitation')
        .select('*')
        .not('checkin_date', 'is', null);
    return { visitation, error };

}

/**
 * 
 * @returns 
 */
const getDraftAnnouncement = async (admin_id) => {
    let { data: announcements, error } = await supabaseClient
        .from('announcements')
        .select('*')
        .eq('status', 'draft')
        .eq('admin_id', admin_id)
    return { announcements, error }
}

/**
 * 
 * @returns 
 */
const getPublishedAnnouncement = async () => {
    let { data: announcements, error } = await supabaseClient
        .from('announcements')
        .select('*')
        .eq('status', 'published')
        .order('publish_date', { ascending: false })
    return { announcements, error }
}

/**
 * 
 * @param {*} announcement_id 
 * @returns 
 */
const getAnnouncementByID = async (announcement_id) => {

    let { data, error } = await supabaseClient
        .from('announcements')
        .select('*')
        .eq('id', announcement_id)
    return { announcements: data[0], error }

}

/**
 * 
 * @returns 
 */
const getNewFeedbacks = async () => {

    let { data: feedbacks, error } = await supabaseClient
        .from('feedbacks')
        .select('*')
        .eq('status', 'pending')
    return { feedbacks, error };
}

/**
 * 
 * @returns 
 */
const getRepliedFeedback = async () => {
    let { data: feedbacks, error } = await supabaseClient
        .from('feedbacks')
        .select('*')
        .eq('status', 'replied')
    return { feedbacks, error };
}

const getFeedbackReplied = async (feedback_id) => {
    let { data, error } = await supabaseClient
        .from('replies')
        .select('*')
        .eq('feedback_id', feedback_id)
    return { replies: data[0], error }
}

const getVisitationByUnitID = async (term) => {

    let { data: visitation, error } = await supabaseClient
        .from('visitation')
        .select('*')
        .eq('unit_id', term)
        .not('checkin_date', 'is', null);
    return { visitation, error };

}

const getResidentsByUnitID = async (term) => {

    /*
    * search contains term
    let unit_id = '%' + term + '%'
    let { data: residents, error } = await supabaseClient
        .from('residents')
        .select('*')
        .like('unit_id', unit_id)
    */

    // find exact unit id of existing residents
    let { data: residents, error: residentError } = await supabaseClient
        .from('residents')
        .select('*,residents_registration!inner(status,proof),accounts(id,email)')
        .eq('unit_id', term)
        .eq('residents_registration.status', 'approved')


    return { residents, error: residentError }
}

/**
 * 
 * @param {*} title 
 * @param {*} description 
 * @param {*} admin_id 
 * @param {*} status 
 * @returns 
 */
const saveDraftAnnouncement = async (title, description, admin_id, status, uploadFile) => {

    if (uploadFile.name != undefined) {
        const { data: img, error: uploadBucketError } = await supabaseClient.storage.from('announcement.img').upload('public/' + uploadFile?.name, uploadFile, {
            cacheControl: '3600',
            upsert: false
        })


        if (img) {

            let { data: announcement, error: announcementError } = await supabaseClient
                .from('announcements')
                .insert([
                    { title: title, description: description, admin_id: admin_id, status: status, images: img },
                ])

            return { error: announcementError };
        } else {
            console.log(uploadBucketError);
            return { error: uploadBucketError }
        }
    } else {
        console.log("no pic")
        let { data: announcement, error: announcementError } = await supabaseClient
            .from('announcements')
            .insert([
                { title: title, description: description, admin_id: admin_id, status: status, },
            ])

        return { error: announcementError };
    }
}

/**
 * 
 * @param {*} title 
 * @param {*} description 
 * @param {*} admin_id 
 * @param {*} status 
 * @param {*} publish_date 
 * @param {*} publish_time 
 * @returns 
 */
const savePublishedAnnouncement = async (title, description, admin_id, status, date, time, uploadFile) => {

    if (uploadFile.name != undefined) {

        const { data: img, error: uploadBucketError } = await supabaseClient.storage.from('announcement.img').upload('public/' + uploadFile?.name, uploadFile, {
            cacheControl: '3600',
            upsert: false
        })
        if (img) {

            let { data: announcement, error: announcementError } = await supabaseClient
                .from('announcements')
                .insert([
                    { title: title, description: description, admin_id: admin_id, status: status, publish_date: date, publish_time: time, images: img },
                ])
            return { error: announcementError };
        } else {
            console.log(uploadBucketError);
            return { error: uploadBucketError }
        }
    } else {
        let { data: announcement, error: announcementError } = await supabaseClient
            .from('announcements')
            .insert([
                { title: title, description: description, admin_id: admin_id, status: status, publish_date: date, publish_time: time },
            ])
        return { error: announcementError };
    }
}

const saveReply = async (feedback_id, admin_id, content) => {

    let { data, error: replyError } = await supabaseClient
        .from('replies')
        .insert([
            { feedback_id: feedback_id, admin_id: admin_id, content: content },
        ])

    if (!replyError) {
        const { data, error: feedbackError } = await supabaseClient
            .from('feedbacks')
            .update({ status: 'replied' })
            .eq('id', feedback_id)

        return { feedbackError }
    }

    return { replyError };
}

const updateRegistration = async (registration_id, status, admin_id) => {
    const { data, error } = await supabaseClient
        .from('residents_registration')
        .update({ status: status, admin_id: admin_id })
        .eq('id', registration_id)
    return { error }
}

/**
 * 
 * @param {*} id 
 * @param {*} title 
 * @param {*} description 
 * @param {*} image 
 * @returns 
 */
const updateDraftAnnouncement = async (id, title, description, uploadFile) => {

    if (uploadFile) {
        const { data: img, error: uploodBucketError } = await supabaseClient.storage.from('announcement.img').upload('public/' + uploadFile?.name, uploadFile, {
            cacheControl: '3600',
            upsert: false
        })
        if (img) {

            const { data: announcement, error: announcementError } = await supabaseClient
                .from('announcements')
                .update({ title: title, description: description, images: img })
                .eq('id', id)
            return { error: announcementError }
        } else {
            console.log(uploodBucketError)
            return { error: uploodBucketError }
        }
    } else {
        const { data: announcement, error: announcementError } = await supabaseClient
            .from('announcements')
            .update({ title: title, description: description })
            .eq('id', id)
        return { error: announcementError }
    }
}

/**
 * 
 * @param {*} id 
 * @param {*} title 
 * @param {*} description 
 * @param {*} status 
 * @param {*} date 
 * @param {*} time 
 * @param {*} image 
 * @returns 
 */
const publishDraftAnnouncement = async (id, title, description, status, date, time, uploadFile) => {
    if (uploadFile) {

        const { data: img, error: uploadBucketError } = await supabaseClient.storage.from('announcement.img').upload('public/' + uploadFile?.name, uploadFile, {
            cacheControl: '3600',
            upsert: false
        })

        if (img) {
            const { data: announcement, error: announcementError } = await supabaseClient
                .from('announcements')
                .update({ title: title, description: description, status: status, publish_date: date, publish_time: time, images: img })
                .eq('id', id)
            return { error: announcementError }
        } else {
            console.log(uploadBucketError)
            return { error: uploadBucketError }
        }
    } else {
        const { data: announcement, error: announcementError } = await supabaseClient
            .from('announcements')
            .update({ title: title, description: description, status: status, publish_date: date, publish_time: time })
            .eq('id', id)
        return { error: announcementError }
    }

}

/**
 * 
 * @param {*} id 
 * @returns 
 */
const removeAnnouncement = async (id) => {

    const { data, error } = await supabaseClient
        .from('announcements')
        .delete()
        .eq('id', id)
    return { error }
}

const updateProfileImage = async (image, id) => {
    const { data: img, error: bucketError } = await supabaseClient.storage.from('admin.profile').upload('public/' + image?.name, image, {
        cacheControl: '3600',
        upsert: false
    })

    if (img) {
        const { data: administrator, error: adminError } = await supabaseClient
            .from('administrators')
            .update({ images: img })
            .eq('account_id', id)
        return { error: adminError }
    } else {
        return { error: bucketError };
    }

}

/**
 * 
 * @param {*} updateMethod 
 */
const listenForFeedbackChanges = async (updateMethod) => {

    const feedbacks = supabaseClient
        .from('feedbacks')
        .on('*', payload => {
            // console.log('Change received!', payload);
            updateMethod();
        })
        .subscribe()
}

/**
 * 
 * @param {*} updateMethod 
 */
const listenForAdministratorChanges = async (updateMethod) => {
    const administrators = supabaseClient.from('administrators').on('*', payload => {
        updateMethod();
    }).subscribe()
}

/**
 * 
 * @param {*} updateMethod 
 */
const listenForAccountChanges = async (updateMethod) => {
    const administrators = supabaseClient.from('accounts').on('*', payload => {
        updateMethod();
    }).subscribe()
}

/**
 * 
 * @param {*} updateMethod 
 */
const listenForSGChanges = async (updateMethod) => {

    const securityGuards = supabaseClient
        .from('security_guards')
        .on('*', payload => {
            updateMethod();
        })
        .subscribe()
}

/**
 * 
 * @param {*} updateMethod 
 */
const listenForRegistration = async (updateMethod) => {

    const residentsRegistration = supabaseClient
        .from('residents_registration')
        .on('*', payload => {
            updateMethod();
        })
        .subscribe()
}

/**
 * 
 * @param {*} updateMethod 
 */
const listenForResident = async (updateMethod) => {

    const residents = supabaseClient
        .from('residents')
        .on('*', payload => {
            updateMethod();
        })
        .subscribe()
}

/**
 * 
 * @param {*} updateMethod 
 */
const listenForVisitationChanges = async (updateMethod) => {
    const visitation = supabaseClient
        .from('visitation')
        .on('*', payload => {
            updateMethod();
        })
        .subscribe()
}

/**
 * 
 * @param {*} updateMethod 
 */
const listenForAnnouncementChanges = async (updateMethod) => {
    const announcements = supabaseClient
        .from('announcements')
        .on('*', payload => {
            updateMethod();
        })
        .subscribe()
}

const listenForAnnouncement = async () => {

    const announcements = supabaseClient
        .from('announcements')
        .on('DELETE', payload => {
            console.log('Change received!', payload)
        })
        .subscribe()
}

/**
 * 
 * @param {*} name 
 * @param {*} ic 
 * @param {*} email 
 * @param {*} password 
 * @param {*} phoneNumber 
 * @param {*} role 
 * @param {*} account_type 
 * @returns 
 */
const signUpMT = async (name, ic, email, password, phoneNumber, role, account_type) => {

    const { data: user, error: createUserError } = await supabaseAdmin.auth.api.createUser({
        email: email,
        password: password,
        email_confirm: true,
    })
    if (!createUserError) {
        // update account
        const { data: account, error: accountError } = await supabaseClient.from('accounts').update({ account_type: account_type }).eq('email', email)
        if (!accountError) {
            //add to admin
            const { data: administrators, error: adminError } = await supabaseClient
                .from('administrators')
                .insert([
                    { account_id: account[0]?.id, name: name, ic: ic, phone_no: phoneNumber, role: role },
                ])
            return { data: administrators, error: adminError };
        }
        return { data: account, error: accountError };
    }
    return { data: user, error: createUserError };



}


const deleteMT = async (id) => {
    // remove from administrators
    const { data: admin, error: adminError } = await supabaseClient
        .from('administrators')
        .delete()
        .eq('account_id', id)
    if (!adminError) {
        // remove from account
        const { data: account, error: accountError } = await supabaseClient
            .from('accounts')
            .delete()
            .eq('id', id)

        if (!accountError) {
            // remove from users
            const { data: user, error: deleteError } = await supabaseAdmin.auth.api.deleteUser(
                id
            )
            return { error: deleteError }
        }
        return { error: accountError };
    }
    return { error: adminError };
}

const deleteSG = async (id) => {
    // remove from security guards

    const { data: guard, error: guardError } = await supabaseClient
        .from('security_guards')
        .delete()
        .eq('account_id', id)

    if (!guardError) {
        // remove from account
        const { data: account, error: accountError } = await supabaseClient
            .from('accounts')
            .delete()
            .eq('id', id)

        if (!accountError) {
            // remove from users
            const { data: user, error: deleteError } = await supabaseAdmin.auth.api.deleteUser(
                id
            )
            return { error: deleteError }
        }
        return { error: accountError };
    }
    return { error: guardError };
}

const deleteResident = async (id) => {
    // account id
    // delete resident
    const { data: residents, error: residentError } = await supabaseClient
        .from('residents')
        .delete()
        .eq('account_id', id)
    console.log(residents);
    if (!residentError) {
        //delete registration
        const { data, error: registrationError } = await supabaseClient
            .from('residents_registration')
            .delete()
            .eq('id', residents[0]?.registration_id)
        console.log("delete me" + data)
        if (!registrationError) {
            // delete accounts
            const { data, error: accountError } = await supabaseClient
                .from('accounts')
                .delete()
                .eq('id', id)
            if (!accountError) {
                // delete from users
                const { data: user, error: deleteError } = await supabaseAdmin.auth.api.deleteUser(
                    id
                )
                return { error: deleteError };
            }

            return { error: accountError }
        }
        return { error: registrationError };
    }

    return ({ error: residentError });



}

const rejectRegistration = () => {
    //remove resident
    //remove registration
    // remove account
    //remove users

}

/**
 * 
 * @param {*} name 
 * @param {*} ic 
 * @param {*} email 
 * @param {*} password 
 * @param {*} phoneNumber 
 * @param {*} account_type 
 * @returns 
 */
const signUpSG = async (name, ic, email, password, phoneNumber, account_type) => {


    const { data: user, error: createUserError } = await supabaseAdmin.auth.api.createUser({
        email: email,
        password: password,
        email_confirm: true,
    })
    if (!createUserError) {
        // update account
        const { data: account, error: accountError } = await supabaseClient.from('accounts').update({ account_type: account_type }).eq('email', email)
        if (!accountError) {
            //add to security guards
            const { data: security_guards, error: sgError } = await supabaseClient
                .from('security_guards')
                .insert([
                    { account_id: account[0]?.id, name: name, ic: ic, phone_no: phoneNumber },
                ])
            return { error: sgError };
        }
        return { error: accountError };
    }
    return { error: createUserError };
}

const resetPassword = async (password, admin_id) => {
    //udpate user
    const { user, error: userError } = await supabaseClient.auth.update({ password: password })
    return { error: userError };

}



/**
 * 
 * @param {*} email 
 * @param {*} password 
 * @returns 
 */
const signIn = async (email, password) => {

    let { data, error: accountError } = await supabaseClient.from('accounts').select('*').eq('email', email)

    if (data[0].account_type == "management") {
        let { user, error: signInError } = await supabaseClient.auth.signIn({
            email,
            password
        })
        return { error: signInError };
    } else {
        return { error: { "message": "Only management is allowed to log in the web application." } }
    }
    return { error: accountError };
}

/**
 * 
 * @returns 
 */
const signOut = async () => {

    let { user, error } = await supabaseClient.auth.signOut();
    return { error };

}

export {
    getAdminstratorByID, getAllAdministrator, getFeedbackByID, getManagementAccountData, getSGAccountData, getResidentAccountData, getResidentByID,
    getAllSecurityGuard, getPendingResidentRegistration, getApprovedResidentRegistration, getAllResident, getAllApprovedResident, getHouseUnit, getTodayVisitation, getAllVisitation,
    getDraftAnnouncement, getPublishedAnnouncement, getAnnouncementByID, getNewFeedbacks, getRepliedFeedback, getFeedbackReplied, getVisitationByUnitID, getResidentsByUnitID,
    saveDraftAnnouncement, savePublishedAnnouncement, saveReply, updateRegistration, updateDraftAnnouncement, publishDraftAnnouncement, removeAnnouncement, updateProfileImage,
    listenForFeedbackChanges, listenForAdministratorChanges, listenForAccountChanges, listenForSGChanges, listenForResident, listenForRegistration, listenForVisitationChanges,
    listenForAnnouncementChanges, listenForAnnouncement, signUpMT, signUpSG, deleteMT, deleteSG, deleteResident, rejectRegistration, resetPassword,
    signIn, signOut
};