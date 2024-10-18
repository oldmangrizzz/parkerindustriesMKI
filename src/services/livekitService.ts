import { Room, RoomEvent, RemoteParticipant, RemoteTrackPublication, RemoteTrack } from 'livekit-client';
import { LIVEKIT_WS_URL } from '../config/env';

class LiveKitService {
  private room: Room | null = null;

  async connect(token: string): Promise<void> {
    this.room = new Room();

    this.room
      .on(RoomEvent.ParticipantConnected, this.handleParticipantConnected)
      .on(RoomEvent.ParticipantDisconnected, this.handleParticipantDisconnected)
      .on(RoomEvent.TrackSubscribed, this.handleTrackSubscribed)
      .on(RoomEvent.TrackUnsubscribed, this.handleTrackUnsubscribed);

    try {
      await this.room.connect(LIVEKIT_WS_URL, token);
      console.log('Connected to LiveKit room:', this.room.name);
    } catch (error) {
      console.error('Error connecting to LiveKit:', error);
    }
  }

  private handleParticipantConnected = (participant: RemoteParticipant) => {
    console.log('Participant connected:', participant.identity);
  };

  private handleParticipantDisconnected = (participant: RemoteParticipant) => {
    console.log('Participant disconnected:', participant.identity);
  };

  private handleTrackSubscribed = (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
    console.log('Track subscribed:', track.kind, 'from', participant.identity);
  };

  private handleTrackUnsubscribed = (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
    console.log('Track unsubscribed:', track.kind, 'from', participant.identity);
  };

  disconnect(): void {
    if (this.room) {
      this.room.disconnect();
      this.room = null;
    }
  }
}

export default new LiveKitService();