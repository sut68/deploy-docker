import { useCallback } from "react";
import { historyAPI } from "../services/https";
import type { CreateHistoryRequest } from "../interfaces";

export const useHistory = () => {
  const createHistory = useCallback(
    async (soundId: number, memberId: number) => {
      try {
        const historyData: CreateHistoryRequest = {
          sound_id: soundId,
          member_id: memberId,
          played_at: new Date().toISOString(),
        };

        const response = await historyAPI.create(historyData);

        if (response.status === 201) {
          console.log("ประวัติการฟังถูกบันทึกแล้ว");
          return true;
        } else {
          console.error("ไม่สามารถบันทึกประวัติการฟังได้:", response);
          return false;
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการบันทึกประวัติการฟัง:", error);
        return false;
      }
    },
    []
  );

  const playSoundWithHistory = useCallback(
    async (soundId: number) => {
      const memberId = localStorage.getItem("id");

      if (!memberId) {
        console.warn("ไม่พบข้อมูลผู้ใช้ ไม่สามารถบันทึกประวัติการฟังได้");
        return false;
      }

      // บันทึกประวัติการฟัง
      const historyResult = await createHistory(soundId, Number(memberId));

      return historyResult;
    },
    [createHistory]
  );

  return {
    createHistory,
    playSoundWithHistory,
  };
};
