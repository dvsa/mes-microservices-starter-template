export default interface LogEvent {
  /**
   * The time the event occurred, expressed as the number of milliseconds after Jan 1, 1970 00:00:00 UTC.
   */
  timestamp: number;

  /**
   * The raw event message string.
   */
  message: string;
}
