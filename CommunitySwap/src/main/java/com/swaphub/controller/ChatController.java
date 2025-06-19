package com.swaphub.controller;

import com.swaphub.model.ChatMessage;
import com.swaphub.model.Conversation;
import com.swaphub.repository.ChatMessageRepository;
import com.swaphub.repository.ConversationRepository;
import com.swaphub.repository.UserRepository;
import com.swaphub.repository.ItemRepository;
import com.swaphub.dto.ConversationRequestDTO;
import com.swaphub.dto.ChatMessageDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

import com.swaphub.model.User;
import com.swaphub.model.Item;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ItemRepository itemRepository;

    // Start a new conversation
    @PostMapping("/conversation")
    public Conversation createConversation(@RequestBody ConversationRequestDTO conversationRequestDTO) {
        User sender = userRepository.findById(conversationRequestDTO.getSenderId())
                            .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(conversationRequestDTO.getReceiverId())
                               .orElseThrow(() -> new RuntimeException("Receiver not found"));
        Item item = itemRepository.findById(conversationRequestDTO.getItemId())
                            .orElseThrow(() -> new RuntimeException("Item not found"));

        Conversation conversation = new Conversation();
        conversation.setUser1(sender);
        conversation.setUser2(receiver);
        conversation.setItem(item);

        return conversationRepository.save(conversation);
    }

    // Send a message
    @PostMapping("/message")
    public ResponseEntity<?> sendMessage(@RequestBody ChatMessageDTO dto) {
        if (dto.getMessage() == null || dto.getMessage().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Message cannot be empty");
        }
        Conversation conversation = conversationRepository.findById(dto.getConversationId())
            .orElseThrow(() -> new RuntimeException("Conversation not found"));
        User sender = userRepository.findById(dto.getSenderId())
            .orElseThrow(() -> new RuntimeException("Sender not found"));

        ChatMessage message = new ChatMessage();
        message.setConversation(conversation);
        message.setSender(sender);
        message.setMessage(dto.getMessage());
        message.setTimestamp(java.time.LocalDateTime.now());

        return ResponseEntity.ok(chatMessageRepository.save(message));
    }

    // Get all messages in a conversation
  @GetMapping("/my-conversations/{userId}")
  public List<Conversation> getMyConversations(@PathVariable UUID userId) {
      return conversationRepository.findByUser1IdOrUser2Id(userId, userId);
  }

    @GetMapping("/conversation/{conversationId}")
    public List<ChatMessage> getMessagesByConversation(@PathVariable UUID conversationId) {
        return chatMessageRepository.findByConversationIdOrderByTimestampAsc(conversationId);
    }
}