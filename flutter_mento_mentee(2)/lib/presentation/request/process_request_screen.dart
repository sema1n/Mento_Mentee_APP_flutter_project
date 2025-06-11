// lib/presentation/request/process_request_screen.dart

import 'package:flutter/material.dart';
import 'package:flutter_mento_mentee/application/mentorship-request/mentorship_request_notifier.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

// import 'package:flutter_mento_mentee/application/request/mentorship_request_notifier.dart';
import 'package:flutter_mento_mentee/infrastructure/models/mentor/create_mentorship_request.dart'
    show UpdateMentorshipStatus, FetchedMentorshipRequest;
import 'package:flutter_mento_mentee/presentation/common_widgets/bottom_bar.dart';

class ProcessRequestScreen extends ConsumerStatefulWidget {
  const ProcessRequestScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<ProcessRequestScreen> createState() =>
      _ProcessRequestScreenState();
}

class _ProcessRequestScreenState extends ConsumerState<ProcessRequestScreen> {
  final int _currentIndex = 4;

  @override
  void initState() {
    super.initState();
    // initial load of mentee-sent requests
    Future.microtask(
      () =>
          ref
              .read(mentorshipRequestNotifierProvider.notifier)
              .fetchAcceptedRequests(),
    );
  }

  @override
  Widget build(BuildContext context) {
    // watch the async state
    final state = ref.watch(mentorshipRequestNotifierProvider);

    // listen for errors
    ref.listen<AsyncValue<List<FetchedMentorshipRequest>>>(
      mentorshipRequestNotifierProvider,
      (_, next) => next.whenOrNull(
        error: (err, _) {
          if (mounted) {
            ScaffoldMessenger.of(
              context,
            ).showSnackBar(SnackBar(content: Text(err.toString())));
          }
        },
      ),
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Process Requests',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: const Color(0xFF3F2C2C),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => context.pop(),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings, color: Colors.white),
            onPressed: () => context.go('/settings'),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh:
            () =>
                ref.read(mentorshipRequestNotifierProvider.notifier).refresh(),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: state.when(
            loading: () => const Center(child: CircularProgressIndicator()),
            error:
                (err, _) => Center(
                  child: Text(
                    err.toString(),
                    style: const TextStyle(color: Colors.red),
                  ),
                ),
            data: (requests) {
              if (requests.isEmpty) {
                return const Center(child: Text('No requests found'));
              }

              final pending =
                  requests.where((r) => r.status == 'pending').toList();
              final addressed =
                  requests.where((r) => r.status != 'pending').toList();

              return CustomScrollView(
                slivers: [
                  if (pending.isNotEmpty) ...[
                    SliverToBoxAdapter(
                      child: const Text(
                        'Pending Requests',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF3F2C2C),
                        ),
                      ),
                    ),
                    SliverList(
                      delegate: SliverChildBuilderDelegate((_, i) {
                        final r = pending[i];
                        return _ActionCard(request: r);
                      }, childCount: pending.length),
                    ),
                    const SliverToBoxAdapter(child: SizedBox(height: 24)),
                  ],
                  if (addressed.isNotEmpty) ...[
                    SliverToBoxAdapter(
                      child: const Text(
                        'Addressed Requests',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF3F2C2C),
                        ),
                      ),
                    ),
                    SliverList(
                      delegate: SliverChildBuilderDelegate((_, i) {
                        final r = addressed[i];
                        return _ReadOnlyCard(request: r);
                      }, childCount: addressed.length),
                    ),
                  ],
                ],
              );
            },
          ),
        ),
      ),
      bottomNavigationBar: MentorBottomBar(
        provider: mentorshipRequestNotifierProvider,
        currentIndex: _currentIndex,
        context: context,
      ),
    );
  }
}

/// Shows “Accept / Reject” buttons for pending requests
class _ActionCard extends ConsumerWidget {
  final FetchedMentorshipRequest request;

  const _ActionCard({required this.request, Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Card(
      elevation: 4,
      margin: const EdgeInsets.symmetric(vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Mentee ID: ${request.menteeId}',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text('Topic: ${request.mentorshipTopic}'),
            Text('Dates: ${request.startDate} → ${request.endDate}'),
            const SizedBox(height: 12),
            Row(
              children: [
                ElevatedButton(
                  onPressed:
                      () => ref
                          .read(mentorshipRequestNotifierProvider.notifier)
                          .updateStatus(
                            request.id!,
                            UpdateMentorshipStatus(status: 'accepted'),
                          ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF3F2C2C),
                  ),
                  child: const Text('Accept'),
                ),
                const SizedBox(width: 8),
                ElevatedButton(
                  onPressed:
                      () => ref
                          .read(mentorshipRequestNotifierProvider.notifier)
                          .updateStatus(
                            request.id!,
                            UpdateMentorshipStatus(status: 'rejected'),
                          ),
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.grey),
                  child: const Text('Reject'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

/// Read-only card for requests already addressed
class _ReadOnlyCard extends StatelessWidget {
  final FetchedMentorshipRequest request;

  const _ReadOnlyCard({required this.request, Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final statusText =
        '${request.status![0].toUpperCase()}${request.status!.substring(1)}';
    final statusColor =
        request.status == 'accepted' ? Colors.green : Colors.red;

    return Card(
      elevation: 4,
      margin: const EdgeInsets.symmetric(vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Mentee ID: ${request.menteeId}',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text('Topic: ${request.mentorshipTopic}'),
            Text('Dates: ${request.startDate} → ${request.endDate}'),
            Text(
              'Status: $statusText',
              style: TextStyle(fontWeight: FontWeight.bold, color: statusColor),
            ),
          ],
        ),
      ),
    );
  }
}
