import {
  useEffect,
  useState,
  useRef,
} from "react";

import { socket } from "../../socket";

import {
  getMessages,
} from "../services/messageService";

const Chat = ({
  ticketId,
  user,
  ticket,
}) => {

  /* ================= STATES ================= */

  const [messages, setMessages] =
    useState([]);

  const [text, setText] =
    useState("");

  const [sending, setSending] =
    useState(false);

  const bottomRef = useRef(null);

  /* ================= CLOSED ================= */

  const isClosed =
    ticket?.status === "CLOSED";

  /* ================= FETCH ================= */

  const fetchMessages =
    async () => {

      try {

        const data =
          await getMessages(
            ticketId
          );

        setMessages(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        console.log(error);

        setMessages([]);

      }

    };

  /* ================= JOIN ROOM ================= */

  useEffect(() => {

    if (!ticketId)
      return;

    socket.emit(
  "join_room",
  ticketId
);

    fetchMessages();

  }, [ticketId]);

  /* ================= RECEIVE MESSAGE ================= */

useEffect(() => {

  const handleReceive =
    (msg) => {

      if (
        Number(msg.ticketId) !==
        Number(ticketId)
      ) return;

      setMessages((prev) => {

        /* PREVENT DUPLICATE */

        const exists =
          prev.some(

            (m) =>
              m.id === msg.id

          );

        if (exists) {

          return prev;

        }

        return [
          ...prev,
          msg
        ];

      });

    };

  socket.on(
    "receive_message",
    handleReceive
  );

  return () => {

    socket.off(
      "receive_message",
      handleReceive
    );

  };

}, [ticketId]);

  /* ================= AUTO SCROLL ================= */

  useEffect(() => {

    bottomRef.current
      ?.scrollIntoView({

        behavior:
          "smooth",

      });

  }, [messages]);

  /* ================= SEND ================= */

  const handleSend =
    async () => {

      if (
        !text.trim() ||
        isClosed ||
        sending
      ) return;

      try {

        setSending(true);

        socket.emit(
          "send_message",
          {

            ticketId,

            senderId:
              user.id,

            message:
              text.trim(),

          }
        );

        setText("");

      } catch (error) {

        console.log(error);

      } finally {

        setSending(false);

      }

    };

  return (

    <div className="
      h-full
      flex
      flex-col
      bg-white
    ">

      {/* ================= HEADER ================= */}

      <div className="
        px-5
        py-4
        border-b
        border-gray-100
        flex
        items-center
        justify-between
      ">

        <div>

          <h2 className="
            text-lg
            font-black
          ">

            Ticket Chat

          </h2>

          <p className="
            text-xs
            text-gray-500
            mt-1
          ">

            Ticket ID :
            #{ticket?.id}

          </p>

        </div>

        {/* STATUS */}

        <div
          className={`
            px-3
            py-1
            rounded-full
            text-xs
            font-bold

            ${
              isClosed
                ? "bg-red-100 text-red-500"
                : "bg-green-100 text-green-600"
            }
          `}
        >

          {isClosed
            ? "Closed"
            : "Open"}

        </div>

      </div>

      {/* ================= MESSAGES ================= */}

      <div className="
        flex-1
        overflow-y-auto
        p-4
        bg-gray-50
        space-y-3
      ">

        {messages.length >
        0 ? (

          messages.map((m) => (

            <div
              key={m.id}
              className={`flex ${
                m.senderId ===
                user.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`
                  max-w-[75%]
                  px-4
                  py-3
                  rounded-2xl
                  text-sm
                  break-words
                  shadow-sm

                  ${
                    m.senderId ===
                    user.id
                      ? "bg-orange-500 text-white rounded-br-md"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
                  }
                `}
              >

                {/* MESSAGE */}

                <p>

                  {m.message}

                </p>

                {/* TIME */}

                <p
                  className={`
                    text-[10px]
                    mt-2
                    text-right

                    ${
                      m.senderId ===
                      user.id
                        ? "text-orange-100"
                        : "text-gray-400"
                    }
                  `}
                >

                  {new Date(
                    m.createdAt
                  ).toLocaleString(
                    "en-IN",
                    {

                      day: "2-digit",

                      month: "2-digit",

                      year: "numeric",

                      hour: "2-digit",

                      minute: "2-digit",

                    }
                  )}

                </p>

              </div>

            </div>

          ))

        ) : (

          <div className="
            h-full
            flex
            items-center
            justify-center
          ">

            <p className="
              text-sm
              text-gray-400
            ">

              No messages yet

            </p>

          </div>

        )}

        <div ref={bottomRef} />

      </div>

      {/* ================= CLOSED MESSAGE ================= */}

      {isClosed && (

        <div className="
          px-4
          py-3
          bg-red-50
          border-t
          border-red-100
        ">

          <p className="
            text-sm
            text-red-500
            text-center
            font-medium
          ">

            This ticket is closed.
            Create a new ticket
            for further support.

          </p>

        </div>

      )}

      {/* ================= INPUT ================= */}

      <div className="
        p-4
        border-t
        border-gray-100
        flex
        gap-3
      ">

        <input
          value={text}
          disabled={
            isClosed
          }
          onChange={(e) =>
            setText(
              e.target.value
            )
          }
          onKeyDown={(e) => {

            if (
              e.key ===
              "Enter"
            ) {

              handleSend();

            }

          }}
          placeholder={
            isClosed
              ? "Ticket closed"
              : "Type message..."
          }
          className={`
            flex-1
            h-12
            px-4
            rounded-2xl
            border
            outline-none
            transition

            ${
              isClosed
                ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-gray-200 focus:ring-2 focus:ring-orange-300"
            }
          `}
        />

        <button
          onClick={
            handleSend
          }
          disabled={
            isClosed ||
            sending
          }
          className={`
            h-12
            px-6
            rounded-2xl
            text-sm
            font-bold
            transition

            ${
              isClosed
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }
          `}
        >

          {sending
            ? "Sending..."
            : "Send"}

        </button>

      </div>

    </div>

  );

};

export default Chat;