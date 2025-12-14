export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  const timeString = date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (diffInMinutes < 1) {
    return `ไม่กี่นาทีที่แล้ว (${timeString})`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} นาทีที่แล้ว (${timeString})`;
  } else {
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ชั่วโมงที่แล้ว (${timeString})`;
    } else {
      return date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }
};

export const formatCurrentDateTime = () => {
  const date = new Date();
  const timeString = date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })} เวลา ${timeString}`;
};
