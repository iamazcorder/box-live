import { IPaging, IPushRes } from '@/interface';
import { ILiveRoom } from '@/types/ILiveRoom';
import request from '@/utils/request';

export function fetchLiveRoomBilibili() {
  return request.get<ILiveRoom>('/live_room/bilibili');
}

export function fetchLiveRoomList(params) {
  return request.get<IPaging<ILiveRoom>>('/live_room/list', {
    params,
  });
}

export function fetchVerifyPkKey(data: { liveRoomId: number; key }) {
  return request.get(`/live_room/verify_pk_key/${data.liveRoomId}`, {
    params: { key: data.key },
  });
}

export function fetchUpdateLiveRoomKey() {
  return request.put<IPushRes>('/live_room/update_key');
}

export function fetchUpdateMyLiveRoom(data: ILiveRoom) {
  return request.put('/live_room/update_my_live_room', data);
}

export function fetchFindLiveRoom(roomId: number) {
  return request.get<ILiveRoom | null>(`/live_room/find/${roomId}`);
}

// 上传封面
export function uploadCover(file, userId) {
  const formData = new FormData();
  formData.append('cover', file); // 将文件添加到 FormData 中
  formData.append('id', userId); // 将用户的 id 添加到 FormData 中

  return request.post('/live_room/upload_cover', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // 设置正确的请求头
    },
  });
}

// 创建直播预告
export function createLiveRoomPreview({
  user_id,
  title,
  preview_date,
  cover_image,
}) {
  const formData = new FormData();
  formData.append('cover', cover_image); // 将文件添加到 FormData 中
  formData.append('user_id', user_id); // 将用户的 id 添加到 FormData 中
  formData.append('title', title);
  formData.append('preview_date', preview_date);

  return request.post('/live_room_previews/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // 设置正确的请求头
    },
  });
}

// 获取用户的预告列表
export function fetchLiveRoomPreviewList(params) {
  return request.get(`/live_room_previews/list`, { params });
}

// 删除用户的预告
export function deleteLiveRoomPreview(data) {
  return request.put(`/live_room_previews/delete`, data);
}

// 预约直播预告
export function createLiveRoomAppointments({
  user_id,
  preview_id,
  appointment_time,
  notification_time,
}) {
  return request.post(`/live_room_appointments/create`, {
    user_id,
    preview_id,
    appointment_time,
    notification_time,
  });
}

// 获取用户的预约列表
export function fetchLiveRoomAppointmentList(params) {
  return request.get(`/live_room_appointments/list`, { params });
}

// 删除用户的预约列表
export function deleteLiveRoomAppointment(data) {
  return request.put(`/live_room_appointments/delete`, data);
}

// 创建直播回放
export function createLiveRoomRecording({
  live_room_id,
  title,
  parent_category_id,
  child_category_id,
  videoFile,
  duration,
}) {
  const formData = new FormData();
  formData.append('live_room_id', live_room_id);
  formData.append('title', title);
  formData.append('parent_category_id', parent_category_id);
  formData.append('child_category_id', child_category_id);
  formData.append('duration', duration);
  formData.append('video', videoFile); // 将文件添加到 FormData 中

  return request.post('/live_room_recordings/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // 设置正确的请求头
    },
  });
}

// 获取用户的直播回放列表
export function fetchLiveRoomRecordings(params) {
  return request.get(`/live_room_recordings/list`, { params });
}

// 创建视频
export function createUserVideo({
  user_id,
  live_room_id,
  title,
  parent_category_id,
  child_category_id,
  coverFile,
  url,
  duration,
  desc,
}) {
  const formData = new FormData();
  formData.append('user_id', user_id);
  formData.append('live_room_id', live_room_id);
  formData.append('title', title);
  formData.append('parent_category_id', parent_category_id);
  formData.append('child_category_id', child_category_id);
  formData.append('cover', coverFile); // 将文件添加到 FormData 中
  formData.append('url', url);
  formData.append('duration', duration);
  formData.append('desc', desc);

  return request.post('/user_videos/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // 设置正确的请求头
    },
  });
}

// 获取视频列表
export function fetchUserVideos(params) {
  return request.get(`/user_videos/list`, { params });
}

// 删除用户的回放
export function deleteLiveRoomRecording(data) {
  return request.put(`/live_room_recordings/delete`, data);
}

// 删除用户发布的视频
export function deleteUserVideo(data) {
  return request.put(`/user_videos/delete`, data);
}

export function fetchVideoInfo(id: number) {
  return request.get(`/user_videos/find/${id}`);
}

// 更新用户的视频
export function updateUserVideo(id: number, data) {
  return request.put(`/user_videos/update/${id}`, data);
}

// 创建用户观看视频记录
export function createUserVideoView({
  user_id,
  video_id,
  duration,
  is_finished,
  watched_at,
}) {
  return request.post(`/user_video_views/create`, {
    user_id,
    video_id,
    duration,
    is_finished,
    watched_at,
  });
}

export function fetchVideoViews(params) {
  return request.get(`/user_video_views/list`, { params });
}

// 创建用户观看直播记录
export function createUserLiveView({
  user_id,
  live_room_id,
  duration,
  watched_at,
}) {
  return request.post(`/user_live_views/create`, {
    user_id,
    live_room_id,
    duration,
    watched_at,
  });
}

export function fetchLiveViews(params) {
  return request.get(`/user_live_views/list`, { params });
}

// 删除用户观看视频记录
export function deleteUserVideoView(data) {
  return request.put(`/user_video_views/delete`, data);
}

// 删除用户观看直播间记录
export function deleteUserLiveView(data) {
  return request.put(`/user_live_views/delete`, data);
}

// 获取正在直播的直播间
export function fetchLivingRooms(params) {
  return request.get(`/live_room/livingList`, { params });
}

// 获取不在直播的直播间
export function fetchNotLiveRooms(params) {
  return request.get(`/live_room/notLiveList`, { params });
}

// 获取根据直播状态排序的所有的直播间列表
export function fetchAllLiveRooms(params) {
  return request.get(`/live_room/allLiveRooms`, { params });
}

export function fetchLiveRoomUserRank(params) {
  return request.get(`/live_room/userRank`, { params });
}
