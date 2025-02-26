import { IList, IPaging, IPushRes } from '@/interface';
import { ILiveRoom } from '@/types/ILiveRoom';
import request from '@/utils/request';

export function fetchLiveRoomBilibili() {
  return request.get<ILiveRoom>('/live_room/bilibili');
}

export function fetchLiveRoomList(params: IList<ILiveRoom>) {
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
